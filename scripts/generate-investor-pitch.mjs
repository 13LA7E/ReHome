import pptxgen from 'pptxgenjs';

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'ReHome';
pptx.company = 'ReHome';
pptx.subject = 'Investor Pitch Deck';
pptx.title = 'ReHome Investor Pitch';
pptx.lang = 'en-US';

const colors = {
  title: '103828',
  text: '2E2E2E',
  muted: '6B7280',
  accent: '1F8F5F',
  accentDark: '146C47',
  bg: 'F4FBF7',
  white: 'FFFFFF',
  line: 'D9E7DF',
  softCard: 'EEF7F1',
};

let slideCounter = 0;

function addChrome(slide, section = '') {
  slideCounter += 1;

  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.22,
    fill: { color: colors.accentDark },
    line: { color: colors.accentDark },
  });

  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0.22,
    w: 13.333,
    h: 0.08,
    fill: { color: 'B7E2CC' },
    line: { color: 'B7E2CC' },
  });

  if (section) {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.65,
      y: 0.43,
      w: Math.max(1.5, section.length * 0.1),
      h: 0.34,
      fill: { color: colors.softCard },
      line: { color: colors.line },
      radius: 0.05,
    });
    slide.addText(section.toUpperCase(), {
      x: 0.75,
      y: 0.5,
      w: Math.max(1.3, section.length * 0.1),
      h: 0.2,
      color: colors.accentDark,
      fontFace: 'Calibri',
      bold: true,
      fontSize: 10,
      align: 'left',
    });
  }

  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 7.28,
    w: 13.333,
    h: 0.22,
    fill: { color: colors.bg },
    line: { color: colors.bg },
  });

  slide.addText('ReHome Investor Deck', {
    x: 0.65,
    y: 7.33,
    w: 3.0,
    h: 0.12,
    color: colors.muted,
    fontFace: 'Calibri',
    fontSize: 9,
  });

  slide.addText(String(slideCounter), {
    x: 12.25,
    y: 7.31,
    w: 0.4,
    h: 0.12,
    color: colors.muted,
    fontFace: 'Calibri',
    fontSize: 9,
    align: 'right',
  });
}

function addTitleSlide(title, subtitle) {
  const slide = pptx.addSlide();
  slide.background = { color: colors.bg };
  addChrome(slide, 'Overview');

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.65,
    y: 1.15,
    w: 12.0,
    h: 4.95,
    fill: { color: colors.white },
    line: { color: colors.line, pt: 1 },
    radius: 0.08,
    shadow: { type: 'outer', color: 'C8D8CF', blur: 2, angle: 45, distance: 2, opacity: 0.2 },
  });

  slide.addShape(pptx.ShapeType.rect, {
    x: 0.9,
    y: 1.45,
    w: 0.18,
    h: 3.9,
    fill: { color: colors.accent },
    line: { color: colors.accent },
  });

  slide.addText(title, {
    x: 1.25, y: 1.65, w: 11.0, h: 1.0,
    fontFace: 'Calibri', bold: true, color: colors.title, fontSize: 50,
  });
  slide.addText(subtitle, {
    x: 1.25, y: 2.75, w: 10.7, h: 2.2,
    fontFace: 'Calibri', color: colors.text, fontSize: 24,
    valign: 'top',
  });

  slide.addText('Circular giving, built for real life.', {
    x: 1.25,
    y: 5.25,
    w: 8.0,
    h: 0.35,
    fontFace: 'Calibri',
    italic: true,
    color: colors.accentDark,
    fontSize: 14,
  });
}

function addBulletSlide(title, bullets, footer = '', section = 'Strategy') {
  const slide = pptx.addSlide();
  slide.background = { color: colors.bg };
  addChrome(slide, section);

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.65,
    y: 1.0,
    w: 12.0,
    h: 6.1,
    fill: { color: colors.white },
    line: { color: colors.line, pt: 1 },
    radius: 0.08,
  });

  slide.addText(title, {
    x: 1.0, y: 1.35, w: 11.0, h: 0.6,
    fontFace: 'Calibri', bold: true, color: colors.title, fontSize: 34,
  });

  const lines = bullets.map((b) => ({
    text: b,
    options: { bullet: { indent: 20 }, hanging: 3 },
  }));
  slide.addText(lines, {
    x: 1.05, y: 2.05, w: 11.0, h: 4.7,
    fontFace: 'Calibri', color: colors.text, fontSize: 21,
    paraSpaceAfterPt: 13,
  });

  if (footer) {
    slide.addText(footer, {
      x: 1.0, y: 6.55, w: 10.8, h: 0.3,
      fontFace: 'Calibri', italic: true, color: colors.accent, fontSize: 14,
      align: 'right',
    });
  }
}

function addRiskSolutionSlide() {
  const slide = pptx.addSlide();
  slide.background = { color: colors.bg };
  addChrome(slide, 'Risk Management');

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.65,
    y: 1.0,
    w: 12.0,
    h: 6.1,
    fill: { color: colors.white },
    line: { color: colors.line, pt: 1 },
    radius: 0.08,
  });

  slide.addText('Key Risks and Solutions', {
    x: 1.0,
    y: 1.35,
    w: 11.0,
    h: 0.6,
    fontFace: 'Calibri',
    bold: true,
    color: colors.title,
    fontSize: 34,
  });

  const rows = [
    ['Behavior change', 'Make donation faster than alternatives and reward repeat use.'],
    ['Logistics margin', 'Batch pickups and set minimum thresholds by zone.'],
    ['Supply mismatch', 'Use partner preference filters and weekly balancing.'],
    ['Fraud and abuse', 'Add verification checkpoints and abuse detection rules.'],
    ['Defensibility', 'Build partner density and proprietary impact data.'],
  ];

  slide.addShape(pptx.ShapeType.rect, {
    x: 1.0,
    y: 2.0,
    w: 3.3,
    h: 0.45,
    fill: { color: colors.softCard },
    line: { color: colors.line },
  });
  slide.addText('RISK', {
    x: 1.15,
    y: 2.1,
    w: 2.8,
    h: 0.2,
    fontFace: 'Calibri',
    bold: true,
    color: colors.accentDark,
    fontSize: 12,
  });

  slide.addShape(pptx.ShapeType.rect, {
    x: 4.35,
    y: 2.0,
    w: 7.7,
    h: 0.45,
    fill: { color: colors.softCard },
    line: { color: colors.line },
  });
  slide.addText('SOLUTION', {
    x: 4.5,
    y: 2.1,
    w: 7.2,
    h: 0.2,
    fontFace: 'Calibri',
    bold: true,
    color: colors.accentDark,
    fontSize: 12,
  });

  let y = 2.48;
  for (const [risk, solution] of rows) {
    slide.addShape(pptx.ShapeType.line, {
      x: 1.0,
      y,
      w: 11.0,
      h: 0,
      line: { color: colors.line, pt: 1 },
    });

    slide.addText(risk, {
      x: 1.15,
      y: y + 0.1,
      w: 3.0,
      h: 0.45,
      fontFace: 'Calibri',
      bold: true,
      color: colors.text,
      fontSize: 14,
    });

    slide.addText(solution, {
      x: 4.5,
      y: y + 0.1,
      w: 7.2,
      h: 0.45,
      fontFace: 'Calibri',
      color: colors.text,
      fontSize: 14,
    });

    y += 0.82;
  }
}

addTitleSlide(
  'ReHome',
  'Turning Household Clutter Into Community Impact\n\nDonate in minutes. Create measurable social and environmental value.'
);

addBulletSlide('The Problem', [
  'People want to donate, but the process is inconvenient and fragmented.',
  'Donors often do not know where items should go or what is accepted.',
  'Usable household goods still end up in landfills.',
  'Community organizations face inconsistent item supply.',
], 'Market friction is a behavior gap, not a motivation gap.', 'Problem');

addBulletSlide('The Solution', [
  'ReHome makes donation simple, trusted, and fast.',
  'Users submit items from home in minutes.',
  'ReHome matches donors with verified local partners for pickup.',
  'Donors get impact visibility and rewards that drive repeat behavior.',
], '', 'Solution');

addBulletSlide('Why Now', [
  'Consumers increasingly demand convenient sustainability options.',
  'Cities and brands need measurable social and environmental outcomes.',
  'Circular economy initiatives are becoming mainstream.',
], '', 'Timing');

addBulletSlide('How It Works', [
  'Donor lists an item quickly.',
  'ReHome helps categorize and route it.',
  'Verified partner receives and coordinates pickup.',
  'Donor sees points, progress, and impact.',
], '', 'Product Flow');

addBulletSlide('Value for Stakeholders', [
  'Donors: easy decluttering, trusted giving, and rewards.',
  'Partners: better incoming inventory and less outreach effort.',
  'Cities/Enterprises: impact reporting inputs and waste-diversion data.',
], '', 'Value');

addBulletSlide('Business Model', [
  'Partner subscriptions for donation intake and operations.',
  'Sponsored rewards and brand partnerships.',
  'Impact reporting packages for municipalities and enterprises.',
], '', 'Monetization');

addBulletSlide('Go-To-Market', [
  'Start in one city with dense partner coverage.',
  'Focus first on high-intent donor segments.',
  'Grow through partner channels, community campaigns, and referrals.',
  'Expand city-by-city with repeatable playbooks.',
], '', 'Growth');

addRiskSolutionSlide();

addBulletSlide('Success Metrics', [
  'Donor repeat rate',
  'Pickup completion rate',
  'Partner 90-day retention',
  'Cost per completed pickup',
  'Contribution margin by city',
  'Total waste diverted and lives impacted',
], '', 'Metrics');

addBulletSlide('Use of Funds', [
  'Partner acquisition and onboarding',
  'Operations quality and reliability',
  'User growth and retention programs',
  'Trust, compliance, and impact reporting infrastructure',
], '', 'Funding Plan');

addBulletSlide('The Ask', [
  'Raise capital to scale partner density in launch markets.',
  'Prove strong unit economics and repeat behavior loops.',
  'Establish ReHome as the trusted operating layer for circular giving.',
], 'ReHome: where convenience meets impact.', 'Closing');

await pptx.writeFile({ fileName: 'ReHome_Investor_Pitch_Deck.pptx' });
console.log('Created ReHome_Investor_Pitch_Deck.pptx');
