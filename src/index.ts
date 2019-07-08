import * as path from "path";
import checkExists from "./checkExists";
import SemanticReleaseError from "./semanticReleaseError";
import errors from "./definitions/errors";
import changeOpenRPCVersion from "./changeOpenRPCVersion";

interface IPluginConfig {
  documentLocation?: string | "./openrpc.json";
}

interface IContext {
  nextRelease?: {
    version?: string;
  };
}

type PluginFunction = (pluginConfig: IPluginConfig, context: IContext) => any;

let verified: boolean = false;

export const verifyConditions: PluginFunction = async (pluginConfig, context): Promise<boolean> => {
  const config: IPluginConfig = {
    documentLocation: pluginConfig.documentLocation || "./openrpc.json",
  };
  const exists = await checkExists(path.resolve(process.cwd(), config.documentLocation!));
  if (!exists) {
    const noDocumentError = errors.ENODOCUMENT();
    throw new SemanticReleaseError(noDocumentError.message, noDocumentError.code, noDocumentError.details);
  }

  verified = true;
  return verified;
};

export const prepare: PluginFunction = async (pluginConfig, context): Promise<boolean> => {
  if (!verified) {
    throw new SemanticReleaseError("Not verified", "ENOTVERIFIED", "Something went wrong and the openrpc.json was not able to be verified."); //tslint:disable-line
  }
  if (!context || !context.nextRelease || !context.nextRelease.version) {
    throw new SemanticReleaseError("No nextRelease version", "ENOVERSION", "Something went wrong and there is no next release version"); //tslint:disable-line
  }
  const config: IPluginConfig = {
    documentLocation: pluginConfig.documentLocation || "./openrpc.json",
  };
  return changeOpenRPCVersion(
    path.resolve(process.cwd(), config.documentLocation!),
    context.nextRelease.version,
  ).then(() => true);
};
