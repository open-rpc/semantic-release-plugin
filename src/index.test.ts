import { prepare, verifyConditions } from "./index";
import SemanticReleaseError from "./semanticReleaseError";
import * as fs from "fs";
import * as path from "path";
import * as util from "util";

const appendFile = util.promisify(fs.appendFile);
const readFile = util.promisify(fs.readFile);

const p = path.resolve(process.cwd(), "./openrpc.json");
const pSrc = path.resolve(process.cwd(), "./src/openrpc.json");

const touchFile = (filePath: string) => {
  fs.closeSync(fs.openSync(filePath, "w"));
};

const removeFile = (filePath: string) => {
  return fs.unlinkSync(filePath);
};

const testOpenRPC = {
  info: {
    version: "0.0.0-development",
  },
};

describe("openrpc plugin", () => {
  describe("verifyConditions", () => {
    it("can error on verifyConditions", () => {
      return verifyConditions({ documentLocation: "./openrpc.json" }, {}).catch((e: SemanticReleaseError) => {
        expect(e.message).toContain("Missing `openrpc.json` document file");
      });
    });
    it("can pass verifyConditions", () => {
      touchFile(p);
      return verifyConditions({ documentLocation: "./openrpc.json" }, {}).then((valid: boolean) => {
        expect(valid).toEqual(true);
        removeFile(p);
      });
    });
  });

  describe("prepare", () => {
    it("can fail if no next release version", () => {
      touchFile(p);
      return prepare({ documentLocation: "./openrpc.json" }, {}).catch((e: SemanticReleaseError) => {
        expect(e.message).toContain("No nextRelease version");
        removeFile(p);
      });
    });
    it("can pass prepare and set the version", async () => {
      touchFile(p);
      await appendFile(p, JSON.stringify(testOpenRPC, null, 4));
      return prepare({ documentLocation: "./openrpc.json" }, { nextRelease: { version: "1.0.0" } })
        .then(async (prepared: boolean) => {
          const file = await readFile(p);
          const openRPCFromFile = JSON.parse(file.toString());
          expect(openRPCFromFile.info.version).toEqual("1.0.0");
          removeFile(p);
        });
    });
    it("can pass prepare and set the version when dir is src", async () => {
      touchFile(pSrc);
      await appendFile(pSrc, JSON.stringify(testOpenRPC, null, 4));
      return prepare({ documentLocation: "src/openrpc.json" }, { nextRelease: { version: "1.0.0" } })
        .then(async (prepared: boolean) => {
          const file = await readFile(pSrc);
          const openRPCFromFile = JSON.parse(file.toString());
          expect(openRPCFromFile.info.version).toEqual("1.0.0");
          removeFile(pSrc);
        });
    });
  });

});
