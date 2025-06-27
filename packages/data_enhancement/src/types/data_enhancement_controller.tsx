import { EntityValues } from "@firecms/core";
import { EditorAIController } from "@firecms/editor";

export type EnhanceParams<M extends object> = {
    entityId: string;
    propertyKey?: string;
    propertyInstructions?: string;
    values: EntityValues<M>;
    instructions?: string;
    replaceValues: boolean;
};

export type DataEnhancementController = {
    /**
     * Whether the data enhancement is enabled for the current path
     */
    enabled: boolean;
    suggestions: Record<string, string | number>;
    enhance: <M extends object>(props: EnhanceParams<M>) => Promise<EnhancedDataResult | null>;
    clearSuggestion: (key: string, suggestion: string | number) => void;
    allowReferenceDataSelection: boolean;
    clearAllSuggestions: () => void;
    getSamplePrompts: (entityName: string, input?: string) => Promise<SamplePromptsResult>;
    loadingSuggestions: string[];
    editorAIController?: EditorAIController;
};

export type EnhancedDataResult = {
    entityId?: string;
    suggestions: {
        [key: string]: string[];
    };
    errors: string[];
    usage: { promptTokens?: number; completionTokens?: number; totalTokens?: number };
};

export type SamplePrompt = {
    prompt: string;
    type: "recent" | "sample";
};

export type SamplePromptsResult = {
    prompts: SamplePrompt[];
    host?: string;
};

export type DataEnhancementRequest = {
    entityName: string;
    entityDescription?: string;
    inputEntity: InputEntity;
    properties: Record<string, InputProperty>;
    propertyKey?: string;
    propertyInstructions?: string;
    instructions?: string;
};

export type InputEntity = {
    entityId: string;
    values: Record<string, any>;
};

export type InputProperty = {
    name?: string;
    description?: string;
    dataType: string;
    fieldConfigId: string;
    enumValues?: string[];
    disabled?: boolean;
    of?: InputProperty;
    oneOf?: {
        properties: Record<string, InputProperty>;
        typeField?: string;
        valueField?: string;
    };
};
