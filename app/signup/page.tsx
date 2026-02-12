export default function SignupPage() {
  return (
    <section className="pageCard stack">
      <h2 className="pageTitle">Attendee signup</h2>
      <p className="muted">Complete this form to appear on the room board with public-safe fields.</p>

      <div className="gridTwo">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" placeholder="Your name" />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="you@company.com" />
          <p className="helper">Email stays private and never appears on the public board.</p>
        </div>
      </div>

      <div className="gridTwo">
        <div className="field">
          <label htmlFor="comfort">AI comfort level (1-5)</label>
          <select id="comfort" name="ai_comfort_level" defaultValue="3">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="linkedin">LinkedIn URL (optional)</label>
          <input id="linkedin" name="linkedin_url" type="url" placeholder="https://linkedin.com/in/..." />
        </div>
      </div>

      <div className="field">
        <label htmlFor="displayTitleCompany">
          <input
            id="displayTitleCompany"
            name="display_title_company"
            type="checkbox"
            defaultChecked={false}
            style={{ marginRight: 8 }}
          />
          Display my title and company on the public room board.
        </label>
      </div>

      <div className="ctaRow">
        <button className="button" type="button">
          Submit signup
        </button>
        <a className="buttonSecondary" href="/room">
          View the room
        </a>
      </div>
    </section>
  );
}
