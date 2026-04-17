export const AI_EXTRACT_RESULTS = {
  'event-4125': {
    summary:
      'This is a Public Works bid for landscaping services along Nicollet Ave. I detected 8 form fields including compliance certifications, pricing sections, and required attachments.',
    confidence: 94,
    fields: [
      { id: 'f1', label: 'Company / Firm Name', type: 'text', placeholder: 'Enter your company name', required: true },
      { id: 'f2', label: 'Authorized Representative', type: 'text', placeholder: 'Full name of signatory', required: true },
      { id: 'f3', label: 'Total Bid Amount ($)', type: 'number', placeholder: '0.00', required: true },
      {
        id: 'f4',
        label: 'Prevailing Wage Agreement',
        type: 'boolean',
        description: 'Bidder agrees to comply with MN Prevailing Wage requirements',
        required: true,
      },
      {
        id: 'f5',
        label: 'Addenda Acknowledged',
        type: 'select',
        options: ['None', 'Addendum 1', 'Addendum 1 & 2', 'Addendum 1, 2 & 3'],
        required: true,
      },
      {
        id: 'f6',
        label: 'Bid Deposit Upload',
        type: 'file',
        accept: '.pdf,.jpg,.png',
        description: 'Upload bid deposit receipt (5% of total bid)',
        required: true,
      },
      {
        id: 'f7',
        label: 'MBE/WBE Certified Business',
        type: 'boolean',
        description: 'Is your firm certified as a Minority or Women-Owned Business?',
        required: false,
      },
      { id: 'f8', label: 'License Number', type: 'text', placeholder: 'MN Contractor License #', required: true },
    ],
  },
  'event-4126': {
    summary:
      'General construction bid form detected. I found 9 fields covering contractor credentials, bonding requirements, and subcontractor details.',
    confidence: 91,
    fields: [
      { id: 'f1', label: 'General Contractor Name', type: 'text', placeholder: 'Company legal name', required: true },
      { id: 'f2', label: 'Base Bid Amount ($)', type: 'number', placeholder: '0.00', required: true },
      {
        id: 'f3',
        label: 'Alternate No. 1 — Enhanced Glazing ($)',
        type: 'number',
        placeholder: '0.00',
        required: false,
      },
      { id: 'f4', label: 'MN Contractor License #', type: 'text', placeholder: 'BC-XXXXXX', required: true },
      {
        id: 'f5',
        label: 'Bid Bond Attached',
        type: 'boolean',
        description: 'Confirm 5% bid bond is included with submission',
        required: true,
      },
      {
        id: 'f6',
        label: 'Addenda Acknowledged',
        type: 'select',
        options: ['None', 'Addendum 1', 'Addendum 1 & 2'],
        required: true,
      },
      {
        id: 'f7',
        label: 'Bid Bond Document',
        type: 'file',
        accept: '.pdf',
        description: 'Upload signed bid bond form',
        required: true,
      },
      {
        id: 'f8',
        label: 'Prevailing Wage Compliance',
        type: 'boolean',
        description: 'Agree to pay prevailing wages per MN Statutes §177.41',
        required: true,
      },
      { id: 'f9', label: 'Subcontractor List', type: 'text', placeholder: 'List primary subs (comma separated)', required: false },
    ],
  },
  default: {
    summary:
      'I analyzed the PDF and detected a standard government bid form. Here are the key fields I found that need to be completed.',
    confidence: 87,
    fields: [
      { id: 'f1', label: 'Company Name', type: 'text', placeholder: 'Your company name', required: true },
      { id: 'f2', label: 'Bid Price ($)', type: 'number', placeholder: '0.00', required: true },
      {
        id: 'f3',
        label: 'Prevailing Wage Agreement',
        type: 'boolean',
        description: 'Agree to comply with prevailing wage requirements',
        required: true,
      },
      {
        id: 'f4',
        label: 'Bid Deposit Upload',
        type: 'file',
        accept: '.pdf',
        description: 'Upload your bid deposit document',
        required: true,
      },
      {
        id: 'f5',
        label: 'Addenda Count',
        type: 'select',
        options: ['None', 'Addendum 1', 'Addendum 1 & 2', 'Addendum 1, 2 & 3'],
        required: true,
      },
    ],
  },
}

export const AI_CHAT_RESPONSES = [
  "I've analyzed the PDF and extracted all fillable fields. You can see them in the form below.",
  'This bid requires a prevailing wage agreement — make sure to toggle that on before submitting.',
  'I noticed the bid deposit is 5% of your total bid amount. Have you calculated that figure yet?',
  "The deadline for this bid is approaching. I'd recommend completing the form today.",
  'All required fields are marked with a red asterisk. Make sure none are left blank.',
  "I can help you estimate the bid price based on similar projects. What's the project scope?",
  'The addenda section requires you to acknowledge all issued amendments. Check the agency portal for the latest count.',
  "Your form looks complete! Click 'Preview Filled PDF' to review before downloading.",
]
