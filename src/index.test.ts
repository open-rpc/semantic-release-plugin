import plugin from "./index";
import SemanticReleaseError from "./semanticReleaseError";
import * as fs from "fs";
import * as path from "path";
import * as util from "util";
import { OpenRPC } from "@open-rpc/meta-schema";

const appendFile = util.promisify(fs.appendFile);
const readFile = util.promisify(fs.readFile);

const p = path.resolve(process.cwd(), "./openrpc.json");

const touchFile = () => {
  fs.closeSync(fs.openSync(p, "w"));
};

const removeFile = () => {
  return fs.unlinkSync(p);
};

const testOpenRPC = {
  info: {
    version: "0.0.0-development",
  },
};

describe("openrpc plugin", () => {
  it("can be required", () => {
    expect(!!plugin).toEqual(true);
  });
  describe("verifyConditions", () => {
    it("can error on verifyConditions", () => {
      const { verifyConditions } = plugin;
      return verifyConditions({ documentLocation: "./openrpc.json" }, {}).catch((e: SemanticReleaseError) => {
        expect(e.message).toContain("Missing `openrpc.json` document file");
      });
    });
    it("can pass verifyConditions", () => {
      const { verifyConditions } = plugin;
      touchFile();
      return verifyConditions({ documentLocation: "./openrpc.json" }, {}).then((valid: boolean) => {
        expect(valid).toEqual(true);
        removeFile();
      });
    });
  });

  describe("prepare", () => {
    it("can fail if no next release version", () => {
      const { prepare } = plugin;
      touchFile();
      return prepare({ documentLocation: "./openrpc.json" }, {}).catch((e: SemanticReleaseError) => {
        expect(e.message).toContain("No nextRelease version");
        removeFile();
      });
    });
    it("can pass prepare and set the version", async () => {
      const { prepare } = plugin;
      touchFile();
      await appendFile(p, JSON.stringify(testOpenRPC, null, 4));
      return prepare({ documentLocation: "./openrpc.json" }, { nextRelease: { version: "1.0.0" } })
        .then(async (prepared: boolean) => {
          const file = await readFile(p);
          const openRPCFromFile = JSON.parse(file.toString());
          expect(openRPCFromFile.info.version).toEqual("1.0.0");
          removeFile();
        });
    });
  });

});
