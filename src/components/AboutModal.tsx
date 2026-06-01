import { Modal } from "./Modal";
import { version as APP_VERSION } from "../../package.json";

const REPO_URL = "https://github.com/marcop135/draw";
const CHANGELOG_URL = `${REPO_URL}/blob/main/CHANGELOG.md`;
const LICENSE_URL = `${REPO_URL}/blob/main/LICENSE`;

type Props = { onClose: () => void };

export function AboutModal({ onClose }: Props) {
  return (
    <Modal title="About draw" onClose={onClose}>
      <p style={{ margin: 0 }}>
        Free whiteboard built on Excalidraw with LaTeX (KaTeX), Mermaid-to-shapes,
        and sanitized Markdown. Static PWA, no backend, no login.
      </p>
      <dl className="about-list">
        <dt>Version</dt>
        <dd>
          <code>v{APP_VERSION}</code>
        </dd>
        <dt>Source</dt>
        <dd>
          <a href={REPO_URL} target="_blank" rel="noreferrer noopener">
            {REPO_URL.replace("https://", "")}
          </a>
        </dd>
        <dt>Changelog</dt>
        <dd>
          <a href={CHANGELOG_URL} target="_blank" rel="noreferrer noopener">
            CHANGELOG.md
          </a>
        </dd>
        <dt>License</dt>
        <dd>
          <a href={LICENSE_URL} target="_blank" rel="noreferrer noopener">
            MIT
          </a>
        </dd>
      </dl>
    </Modal>
  );
}
