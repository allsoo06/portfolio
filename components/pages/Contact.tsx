import type { Profile } from "@/lib/types";

export default function Contact({ profile }: { profile: Profile }) {
  const { contact } = profile;

  return (
    <div>
      <h2># contact</h2>
      <div className="contact-grid">
        {contact?.github && (
          <a
            className="big-link"
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="big-icon">🐙</span>
            <div>
              <b>GitHub</b>
              <small>{contact.github}</small>
            </div>
          </a>
        )}
        {contact?.email && (
          <a className="big-link" href={`mailto:${contact.email}`}>
            <span className="big-icon">✉️</span>
            <div>
              <b>Email</b>
              <small>{contact.email}</small>
            </div>
          </a>
        )}
      </div>
      <p className="hint">
        © {new Date().getFullYear()} {profile.name}
      </p>
    </div>
  );
}
