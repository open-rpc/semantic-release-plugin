import * as util from "util";
import * as fs from "fs";
import { OpenRPC } from "@open-rpc/meta-schema";

const promisifiedFsReadFile = util.promisify(fs.readFile);
const promisifiedFsWriteFile = util.promisify(fs.writeFile);

const changeOpenRPCVersion = async (p: string, version: string): Promise<any> => {
  const file = await promisifiedFsReadFile(p);
  const openrpc: OpenRPC = JSON.parse(file.toString());
  openrpc.info.version = version;
  return promisifiedFsWriteFile(p, JSON.stringify(openrpc, null, 4));
};

export default changeOpenRPCVersion;
