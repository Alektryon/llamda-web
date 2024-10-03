type FunctionMetadata = {
  name?: string;
  description?: string;
};

type ParameterType = {
  type: string;
  description?: string;
};

type FunctionSchema = {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, ParameterType>;
    required: string[];
  };
  returnType: ParameterType;
};