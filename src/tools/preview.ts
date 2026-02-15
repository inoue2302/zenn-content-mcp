import { spawn, type ChildProcess } from "child_process";
import { z } from "zod";
import { getZennProjectDir } from "../utils/zenn-path.js";

let previewProcess: ChildProcess | null = null;
let previewPort: number | null = null;

export const previewSchema = {
  action: z.enum(["start", "stop", "status"]).describe("start / stop / status"),
  port: z.number().default(8000).describe("プレビューサーバーのポート番号"),
};

export async function preview({
  action,
  port,
}: {
  action: string;
  port: number;
}) {
  if (action === "status") {
    const running = previewProcess !== null && previewProcess.exitCode === null;
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            running,
            port: running ? previewPort : null,
            url: running ? `http://localhost:${previewPort}` : null,
          }),
        },
      ],
    };
  }

  if (action === "stop") {
    if (previewProcess && previewProcess.exitCode === null) {
      previewProcess.kill();
      previewProcess = null;
      previewPort = null;
      return {
        content: [
          { type: "text" as const, text: "プレビューサーバーを停止しました" },
        ],
      };
    }
    return {
      content: [
        {
          type: "text" as const,
          text: "プレビューサーバーは起動していません",
        },
      ],
    };
  }

  // action === "start"
  if (previewProcess && previewProcess.exitCode === null) {
    return {
      content: [
        {
          type: "text" as const,
          text: `プレビューサーバーは既に起動中です: http://localhost:${previewPort}`,
        },
      ],
    };
  }

  const projectDir = getZennProjectDir();

  previewProcess = spawn("npx", ["zenn", "preview", "--port", String(port)], {
    cwd: projectDir,
    stdio: "ignore",
    detached: false,
  });

  previewPort = port;

  previewProcess.on("exit", () => {
    previewProcess = null;
    previewPort = null;
  });

  return {
    content: [
      {
        type: "text" as const,
        text: `プレビューサーバーを起動しました: http://localhost:${port}`,
      },
    ],
  };
}
