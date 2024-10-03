import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';

export class LlamdaAnalyzer {
  private functions: Map<string, FunctionSchema> = new Map();

  fy(metadata: FunctionMetadata = {}) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      const originalMethod = descriptor.value;
      const functionName = metadata.name || propertyKey;
      const functionDescription = this.extractDescription(originalMethod, metadata);
      const { paramTypes, returnType } = this.getTypeInfo(target, propertyKey);

      const schema: FunctionSchema = {
        name: functionName,
        description: functionDescription,
        parameters: {
          type: 'object',
          properties: paramTypes,
          required: Object.keys(paramTypes),
        },
        returnType: returnType,
      };

      this.functions.set(functionName, schema);
      this.saveFunction(functionName, originalMethod, schema);

      return descriptor;
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

  private getTypeInfo(target: any, propertyKey: string): { paramTypes: Record<string, ParameterType>, returnType: ParameterType } {
    const program = ts.createProgram([target.constructor.name + '.ts'], {});
    const sourceFile = program.getSourceFile(target.constructor.name + '.ts');
    const typeChecker = program.getTypeChecker();

    let paramTypes: Record<string, ParameterType> = {};
    let returnType: ParameterType = { type: 'any' };

    if (sourceFile) {
      ts.forEachChild(sourceFile, (node) => {
        if (ts.isClassDeclaration(node) && node.name?.text === target.constructor.name) {
          node.members.forEach((member) => {
            if (ts.isMethodDeclaration(member) && member.name.getText() === propertyKey) {
              const signature = typeChecker.getSignatureFromDeclaration(member);
              if (signature) {
                paramTypes = this.getParameterTypes(signature, typeChecker);
                returnType = this.getReturnType(signature, typeChecker);
              }
            }
          });
        }
      });
    }

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

  private saveFunction(name: string, func: Function, schema: FunctionSchema) {
    const dir = path.join(process.cwd(), 'src', 'components', 'llamda', 'default_functions');
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

  getAnalyzedSchemas(): Map<string, FunctionSchema> {
    return new Map(this.functions);
  }
}