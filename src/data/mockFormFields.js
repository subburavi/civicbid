// Fields per document per bid
export const DOCUMENT_FIELDS = {
  'event-4125': {
    doc1: {
      fields: [
        { id: 'f1', label: 'Company / Firm Name', type: 'text', placeholder: 'Enter your company name', required: true },
        { id: 'f2', label: 'Authorized Representative', type: 'text', placeholder: 'Full name of signatory', required: true },
        { id: 'f3', label: 'Total Bid Amount ($)', type: 'number', placeholder: '0.00', required: true },
        { id: 'f4', label: 'Prevailing Wage Agreement', type: 'boolean', description: 'Bidder agrees to comply with MN Prevailing Wage requirements', required: true },
        { id: 'f5', label: 'Addenda Acknowledged', type: 'select', options: ['None', 'Addendum 1', 'Addendum 1 & 2', 'Addendum 1, 2 & 3'], required: true },
        { id: 'f6', label: 'Bid Deposit Upload', type: 'file', accept: '.pdf,.jpg,.png', description: 'Upload bid deposit receipt (5% of total bid)', required: true },
        { id: 'f7', label: 'MBE/WBE Certified Business', type: 'boolean', description: 'Is your firm certified as a Minority or Women-Owned Business?', required: false },
        { id: 'f8', label: 'MN Contractor License Number', type: 'text', placeholder: 'BC-XXXXXX', required: true },
      ],
    },
    doc2: {
      fields: [
        { id: 'g1', label: 'Event ID Confirmation', type: 'text', placeholder: 'MPLMN-0000004125', required: true },
        { id: 'g2', label: 'Bidder Company Name', type: 'text', placeholder: 'Legal company name', required: true },
        { id: 'g3', label: 'Base Bid Amount ($)', type: 'number', placeholder: '0.00', required: true },
        { id: 'g4', label: 'Responsible Contractor Verification', type: 'boolean', description: 'Bids exceeding $50,000 must include signed Responsible Contractor form', required: true },
        { id: 'g5', label: 'Addenda Received and Reviewed', type: 'select', options: ['Received and Reviewed Zero Addendums', 'Received and Reviewed One Addendum', 'Received and Reviewed Two Addendums', 'Received and Reviewed Three Addendums'], required: true },
      ],
    },
  },
  'event-4126': {
    doc1: {
      fields: [
        { id: 'f1', label: 'General Contractor Name', type: 'text', placeholder: 'Company legal name', required: true },
        { id: 'f2', label: 'Base Bid Amount ($)', type: 'number', placeholder: '0.00', required: true },
        { id: 'f3', label: 'Alternate No. 1 — Enhanced Glazing ($)', type: 'number', placeholder: '0.00', required: false },
        { id: 'f4', label: 'MN Contractor License #', type: 'text', placeholder: 'BC-XXXXXX', required: true },
        { id: 'f5', label: 'Bid Bond Attached', type: 'boolean', description: 'Confirm 5% bid bond is included', required: true },
      ],
    },
    doc2: {
      fields: [
        { id: 'g1', label: 'Bidder Name', type: 'text', placeholder: 'Company name', required: true },
        { id: 'g2', label: 'Addenda Acknowledged', type: 'select', options: ['None', 'Addendum 1', 'Addendum 1 & 2'], required: true },
        { id: 'g3', label: 'Bid Bond Document', type: 'file', accept: '.pdf', description: 'Upload signed bid bond form', required: true },
        { id: 'g4', label: 'Prevailing Wage Compliance', type: 'boolean', description: 'Agree to pay prevailing wages per MN Statutes §177.41', required: true },
      ],
    },
  },
  default: {
    doc1: {
      fields: [
        { id: 'f1', label: 'Company Name', type: 'text', placeholder: 'Your company name', required: true },
        { id: 'f2', label: 'Bid Price ($)', type: 'number', placeholder: '0.00', required: true },
        { id: 'f3', label: 'Prevailing Wage Agreement', type: 'boolean', description: 'Agree to comply with prevailing wage requirements', required: true },
        { id: 'f4', label: 'Bid Deposit Upload', type: 'file', accept: '.pdf', description: 'Upload your bid deposit document', required: true },
        { id: 'f5', label: 'Addenda Count', type: 'select', options: ['None', 'Addendum 1', 'Addendum 1 & 2', 'Addendum 1, 2 & 3'], required: true },
      ],
    },
    doc2: {
      fields: [
        { id: 'g1', label: 'Bidder Company Name', type: 'text', placeholder: 'Legal company name', required: true },
        { id: 'g2', label: 'Authorized Signatory', type: 'text', placeholder: 'Name of authorized representative', required: true },
        { id: 'g3', label: 'Submission Date', type: 'text', placeholder: 'MM/DD/YYYY', required: true },
        { id: 'g4', label: 'Contractor License', type: 'text', placeholder: 'MN License #', required: true },
      ],
    },
  },
}

// Pre-filled prototype answers — used for demo
export const AUTO_FILL_ANSWERS = {
  'event-4125': {
    doc1: {
      f1: 'Abdullahi Engineering LLC',
      f2: 'Moha Abdullahi, PE',
      f3: '38500',
      f4: true,
      f5: 'Addendum 1',
      f7: true,
      f8: 'BC-204871',
    },
    doc2: {
      g1: 'MPLMN-0000004125',
      g2: 'Abdullahi Engineering LLC',
      g3: '38500',
      g4: true,
      g5: 'Received and Reviewed One Addendum',
    },
  },
  'event-4126': {
    doc1: {
      f1: 'Abdullahi Engineering LLC',
      f2: '1175000',
      f4: 'BC-204871',
      f5: true,
    },
    doc2: {
      g1: 'Abdullahi Engineering LLC',
      g2: 'Addendum 1',
      g4: true,
    },
  },
}

export const AI_CHAT_RESPONSES = [
  "I've analyzed the PDF and extracted all fillable fields. You can see them in the form below.",
  'This bid requires a prevailing wage agreement — make sure to toggle that on before submitting.',
  'I noticed the bid deposit is 5% of your total bid amount. Have you calculated that figure yet?',
  "The deadline for this bid is approaching. I'd recommend completing the form today.",
  'All required fields are marked with a red asterisk. Make sure none are left blank.',
  'The addenda section requires you to acknowledge all issued amendments. Check the agency portal for the latest count.',
  "Your form looks complete! Click 'Preview Filled PDF' to review before downloading.",
]
