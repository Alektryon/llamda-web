import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';

class Llamda {
  private functions: Map<string, Function> = new Map();
  private schemas: Map<string, FunctionSchema> = new Map();

  constructor() {
    this.loadFunctions('default_functions');
    this.loadFunctions('user_functions');
  }

  private loadFunctions(dirName: string) {
    const dir = path.join(process.cwd(), 'src', 'components', 'llamda', dirName);
    if (fs.existsSync(dir)) {
      fs.readdirSync(dir).forEach(file => {
        if (file.endsWith('.ts')) {
          const { default: func, schema } = require(path.join(dir, file));
          const name = path.basename(file, '.ts');
          this.functions.set(name, func);
          this.schemas.set(name, schema);
        }
      });
    }
  }

  registerFunction(name: string, func: Function, metadata: FunctionMetadata = {}) {
    const schema = this.analyzeFunctionDynamically(func, name, metadata);
    this.saveUserFunction(name, func, schema);
    this.functions.set(name, func);
    this.schemas.set(name, schema);
  }

  private saveUserFunction(name: string, func: Function, schema: FunctionSchema) {
    const dir = path.join(process.cwd(), 'src', 'components', 'llamda', 'user_functions');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const filePath = path.join(dir, `${name}.ts`);
    const content = `
import { FunctionSchema } from '../LlamdaTypes';

export const schema: FunctionSchema = ${JSON.stringify(schema, null, 2)};

export default ${func.toString()};
`;

    fs.writeFileSync(filePath, content);
  }

  private analyzeFunctionDynamically(func: Function, name: string, metadata: FunctionMetadata): FunctionSchema {
    const functionDescription = this.extractDescription(func, metadata);
    const { paramTypes, returnType } = this.getTypeInfoDynamically(func);

    return {
      name: name,
      description: functionDescription,
      parameters: {
        type: 'object',
        properties: paramTypes,
        required: Object.keys(paramTypes),
      },
      returnType: returnType,
    };
  }

  private extractDescription(func: Function, metadata: FunctionMetadata): string {
    if (metadata.description) {
      return metadata.description;
    }

    const funcString = func.toString();
    const docstringMatch = funcString.match(/\/\*\*([\s\S]*?)\*\//);
    if (docstringMatch) {
      return docstringMatch[1].replace(/^\s*\*\s?/gm, '').trim();
    }

    return '';
  }

  private getTypeInfoDynamically(func: Function): { paramTypes: Record<string, ParameterType>, returnType: ParameterType } {
    const sourceFile = ts.createSourceFile(
      'temp.ts',
      `const tempFunc = ${func.toString()}`,
      ts.ScriptTarget.Latest,
      true
    );

    const program = ts.createProgram(['temp.ts'], {}, {
      getSourceFile: (fileName) => fileName === 'temp.ts' ? sourceFile : undefined,
      writeFile: () => {},
      getCurrentDirectory: () => '',
      getDirectories: () => [],
      getCanonicalFileName: (fileName) => fileName,
      useCaseSensitiveFileNames: () => true,
      getNewLine: () => '\n',
      fileExists: () => true,
      readFile: () => '',
      getDefaultLibFileName: () => 'lib.d.ts',
    });

    const typeChecker = program.getTypeChecker();
    let paramTypes: Record<string, ParameterType> = {};
    let returnType: ParameterType = { type: 'any' };

    ts.forEachChild(sourceFile, (node) => {
      if (ts.isVariableStatement(node)) {
        const declaration = node.declarationList.declarations[0];
        if (ts.isVariableDeclaration(declaration) && declaration.initializer && ts.isFunctionExpression(declaration.initializer)) {
          const signature = typeChecker.getSignatureFromDeclaration(declaration.initializer);
          if (signature) {
            paramTypes = this.getParameterTypes(signature, typeChecker);
            returnType = this.getReturnType(signature, typeChecker);
          }
        }
      }
    });

    return { paramTypes, returnType };
  }

  private getParameterTypes(signature: ts.Signature, typeChecker: ts.TypeChecker): Record<string, ParameterType> {
    const paramTypes: Record<string, ParameterType> = {};
    signature.parameters.forEach((param) => {
      const paramName = param.getName();
      const paramType = typeChecker.getTypeOfSymbolAtLocation(param, param.valueDeclaration!);
      paramTypes[paramName] = {
        type: typeChecker.typeToString(paramType),
        description: ts.displayPartsToString(param.getDocumentationComment(typeChecker)),
      };
    });
    return paramTypes;
  }

  private getReturnType(signature: ts.Signature, typeChecker: ts.TypeChecker): ParameterType {
    const returnType = typeChecker.getReturnTypeOfSignature(signature);
    return {
      type: typeChecker.typeToString(returnType),
    };
  }

  getToolsSchema(): FunctionSchema[] {
    return Array.from(this.schemas.values());
  }

  callFunction(name: string, args: any): any {
    const func = this.functions.get(name);
    if (!func) {
      throw new Error(`Function not found: ${name}`);
    }
    return func(args);
  }
}

export { Llamda };