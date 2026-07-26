const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
async function main() {
  const users = await p.user.findMany({ select: { id: true, name: true, email: true, onboarded: true } });
  console.log('Users:', JSON.stringify(users));
  const paths = await p.careerPath.count();
  console.log('Paths:', paths);
  const apps = await p.jobApplication.count();
  console.log('Applications:', apps);
  const assess = await p.assessment.count();
  console.log('Assessments:', assess);
  const skills = await p.skillGap.count();
  console.log('SkillGaps:', skills);
  const resume = await p.resume.count();
  console.log('Resumes:', resume);
  await p.$disconnect();
}
main().catch(e => console.error(e));
