export function generateMockData(bid, profile) {
  const company = profile?.companyName || 'Vanguard Civil Solutions'
  const phone = profile?.phone || '(612) 555-0191'
  const category = bid?.category || 'General Services'
  const agency = bid?.agency || 'the Agency'
  const budget = bid?.budget || 'TBD'
  const deadline = bid?.deadline || 'TBD'
  const title = bid?.title || 'Project'

  return {
    cover: {
      firmName: company,
      firmTagline: 'Transportation · Infrastructure · Environment',
      proposalTag: 'Proposal for Professional Services',
      title,
      subtitle: agency,
      projectId: bid?.id ? `Project Ref: ${bid.id.toUpperCase()}` : 'Project Reference',
      agency,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      contact: {
        name: company,
        phone,
        email: 'contact@firm.com',
        address: 'Minneapolis, MN 55401',
      },
    },
    sections: [
      {
        id: 'introduction', title: 'Introduction',
        content: `<p>${company} is pleased to submit this proposal in response to the solicitation for <strong>${title}</strong> issued by ${agency}. We bring demonstrated expertise in ${category.toLowerCase()} and a proven track record of successful government contract delivery.</p><p>Our approach is rooted in collaboration, transparency, and an unwavering commitment to meeting — and exceeding — the expectations of our public-sector clients. We are fully prepared to deliver exceptional results on time and within budget.</p>`,
      },
      {
        id: 'scope', title: 'Scope of Work',
        content: `<p>Our proposed scope encompasses all deliverables outlined in the bid specifications for <strong>${title}</strong>. Key activities include:</p><ul><li>Pre-mobilization planning and stakeholder coordination with ${agency}</li><li>Full compliance with applicable local, state, and federal regulations</li><li>Mobilization within five (5) business days of Notice to Proceed</li><li>Weekly progress reporting and documentation throughout all project phases</li><li>Final quality inspection, punch-list resolution, and formal project closeout</li></ul><p>A dedicated coordinator will maintain direct communication with the ${agency} project manager at every milestone.</p>`,
      },
      {
        id: 'team', title: 'Team',
        content: `<p><strong>${company}</strong> fields a multidisciplinary team purpose-built for ${category.toLowerCase()} contracts of this scope:</p><ul><li><strong>Project Manager</strong> — 15+ years in government ${category.toLowerCase()} contracts; primary client point of contact</li><li><strong>Field Supervisor</strong> — Licensed and fully insured; day-to-day on-site operations and safety compliance</li><li><strong>Quality Assurance Lead</strong> — Verifies all deliverables meet or exceed specification requirements</li><li><strong>Compliance Officer</strong> — Manages prevailing wage documentation, reporting, and regulatory filings</li></ul>`,
      },
      {
        id: 'timeline', title: 'Timeline',
        content: `<p>We propose the following phased schedule, designed to deliver the full scope by <strong>${deadline}</strong>:</p><ul><li><strong>Week 1–2:</strong> Mobilization, preconstruction meeting, permitting, and site preparation</li><li><strong>Week 3–7:</strong> Phase 1 — Primary scope execution with weekly written progress reports</li><li><strong>Week 8–10:</strong> Phase 2 — Secondary activities, ongoing quality reviews, and issue remediation</li><li><strong>Week 11–12:</strong> Final inspections, punch-list completion, documentation, and formal closeout</li></ul><p>The schedule includes buffer for weather-related delays and regulatory review cycles, ensuring on-time delivery.</p>`,
      },
      {
        id: 'pricing', title: 'Pricing',
        content: `<p>Our total bid is structured to deliver maximum value within the project budget of <strong>${budget}</strong>:</p><ul><li><strong>Direct Labor (Prevailing Wage Compliant):</strong> Itemized per trade classification and estimated hours</li><li><strong>Materials &amp; Equipment:</strong> Priced per approved specifications; substitutions require written approval</li><li><strong>Project Management &amp; Overhead:</strong> 12% of direct costs — coordination, reporting, and compliance</li><li><strong>Contingency Reserve (5%):</strong> Per standard government contracting practice</li></ul><p>A detailed line-item cost schedule is available upon request. ${company} maintains an open-book policy on all change orders.</p>`,
      },
    ],
  }
}

export function mockEditSection(section, instruction) {
  const lc = instruction.toLowerCase()
  const { title, content } = section

  if (lc.includes('short') || lc.includes('concise') || lc.includes('brief'))
    return `<p>Our team will deliver all requirements for the <strong>${title}</strong> scope with precision, efficiency, and full compliance with the project specifications. We bring the expertise and resources needed to complete this work on time and within budget.</p>`

  if (lc.includes('formal') || lc.includes('tone'))
    return content
      .replace(/We bring/g, 'The organization possesses')
      .replace(/Our team/g, 'The assigned project team')
      .replace(/we will/g, 'the Contractor shall')
      .replace(/we are/g, 'the firm is')

  if (lc.includes('bullet') || lc.includes('list'))
    return `<p>Key highlights for the <strong>${title}</strong> section:</p><ul><li>Proven methodology aligned with agency requirements and specifications</li><li>Dedicated, licensed professionals with direct government-contract experience</li><li>Full regulatory compliance — prevailing wage, insurance, bonding, and reporting</li><li>Transparent, milestone-based communication framework</li><li>On-time, on-budget delivery commitment with zero scope surprises</li></ul>`

  return content + `<p><em>Additionally, we wish to emphasize: ${instruction}. This commitment is reflected throughout our project approach and will be documented in all weekly progress reports submitted to the agency.</em></p>`
}

export function mockEditSelection(selectedText, instruction) {
  const lc = instruction.toLowerCase()
  const first = selectedText.substring(0, 45).trim()

  if (lc.includes('stronger') || lc.includes('confident') || lc.includes('bold'))
    return `We are uniquely qualified and fully committed to delivering ${first}… with the highest standard of professional excellence and accountability.`
  if (lc.includes('short') || lc.includes('concise'))
    return `${first.split(' ').slice(0, 7).join(' ')} — delivered with precision.`
  if (lc.includes('formal'))
    return `The organization is prepared to ensure ${first}… in full accordance with applicable contractual and regulatory obligations.`

  return `${first}… — revised to reflect ${instruction.toLowerCase()}, in full alignment with the project goals and agency expectations.`
}
