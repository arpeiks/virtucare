import dotenv from "dotenv";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

dotenv.config();
dotenv.config({ path: ".env.local" });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

const specialties = [
  { specialty: "Cardiology", subspecialties: ["Interventional Cardiology", "Electrophysiology", "Heart Failure"] },
  { specialty: "Dermatology", subspecialties: ["Cosmetic Dermatology", "Pediatric Dermatology", "Dermatopathology"] },
  { specialty: "Endocrinology", subspecialties: ["Diabetes", "Thyroid Disorders", "Reproductive Endocrinology"] },
  { specialty: "Gastroenterology", subspecialties: ["Hepatology", "Inflammatory Bowel Disease", "Pancreatic Disorders"] },
  { specialty: "Neurology", subspecialties: ["Stroke", "Epilepsy", "Movement Disorders"] },
  { specialty: "Oncology", subspecialties: ["Medical Oncology", "Radiation Oncology", "Surgical Oncology"] },
  { specialty: "Orthopedics", subspecialties: ["Sports Medicine", "Joint Replacement", "Spine Surgery"] },
  { specialty: "Pediatrics", subspecialties: ["Neonatology", "Pediatric Cardiology", "Developmental Pediatrics"] },
  { specialty: "Psychiatry", subspecialties: ["Child Psychiatry", "Addiction Medicine", "Geriatric Psychiatry"] },
  { specialty: "Pulmonology", subspecialties: ["Critical Care", "Sleep Medicine", "Interventional Pulmonology"] },
];

const firstNames = [
  "Sarah", "Michael", "Emily", "David", "Jessica", "James", "Jennifer", "Robert",
  "Amanda", "Christopher", "Lisa", "Daniel", "Michelle", "Matthew", "Ashley", "Andrew",
  "Stephanie", "Joshua", "Nicole", "Brian", "Rachel", "Kevin", "Laura", "Ryan",
  "Melissa", "Jason", "Rebecca", "Justin", "Amy", "Brandon", "Samantha", "Eric",
  "Elizabeth", "Tyler", "Heather", "Aaron", "Megan", "Adam", "Katherine", "Jonathan",
  "Angela", "Nathan", "Christine", "William", "Maria", "Benjamin", "Patricia", "Jacob",
  "Linda", "Alexander"
];

const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas",
  "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White",
  "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young",
  "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
  "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell",
  "Carter", "Roberts"
];

const locations = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
  "Dallas, TX",
  "San Jose, CA",
  "Austin, TX",
  "Jacksonville, FL",
  "Fort Worth, TX",
  "Columbus, OH",
  "Charlotte, NC",
  "San Francisco, CA",
  "Indianapolis, IN",
  "Seattle, WA",
  "Denver, CO",
  "Boston, MA",
];

const availabilityOptions = ["Today", "Tomorrow", "Next week", "In 2 days", "In 3 days"];

const bioTemplates = [
  "Board-certified physician with extensive experience in {specialty}. Committed to providing compassionate, evidence-based care.",
  "Experienced {specialty} specialist dedicated to patient-centered care and innovative treatment approaches.",
  "Passionate about helping patients achieve optimal health through personalized {specialty} care.",
  "Fellowship-trained in {subspecialty} with a focus on comprehensive patient care and education.",
  "Dedicated to advancing {specialty} through clinical excellence and patient advocacy.",
];

function generateSlotsByDay(): string {
  const slots: Record<number, string[]> = {};
  for (let day = 0; day < 7; day++) {
    const daySlots: string[] = [];
    const numSlots = Math.floor(Math.random() * 8) + 4;
    const startHour = 8 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < numSlots; i++) {
      const hour = startHour + i;
      if (hour >= 17) break;
      const minutes = Math.random() > 0.5 ? "00" : "30";
      daySlots.push(`${hour.toString().padStart(2, "0")}:${minutes}`);
    }
    slots[day] = daySlots;
  }
  return JSON.stringify(slots);
}

function generateRating(): string {
  const ratings = ["4.5", "4.6", "4.7", "4.8", "4.9", "5.0"];
  return ratings[Math.floor(Math.random() * ratings.length)];
}

function generateReviews(): number {
  return Math.floor(Math.random() * 500) + 50;
}

function generateYears(): number {
  return Math.floor(Math.random() * 25) + 5;
}

function generateBio(specialty: string, subspecialty?: string): string {
  const template = bioTemplates[Math.floor(Math.random() * bioTemplates.length)];
  return template
    .replace("{specialty}", specialty)
    .replace("{subspecialty}", subspecialty || specialty);
}

async function seed() {
  console.log("🌱 Seeding database with doctors...");

  const doctors = [];
  let doctorIndex = 0;

  for (const { specialty, subspecialties } of specialties) {
    for (let i = 0; i < 5; i++) {
      const firstName = firstNames[doctorIndex % firstNames.length];
      const lastName = lastNames[doctorIndex % lastNames.length];
      const subspecialty = subspecialties[i % subspecialties.length];

      doctors.push({
        id: `doctor-${doctorIndex + 1}`,
        name: `Dr. ${firstName} ${lastName}`,
        specialty,
        subspecialty,
        bio: generateBio(specialty, subspecialty),
        imageUrl: `https://i.pravatar.cc/300?img=${(doctorIndex % 70) + 1}`,
        rating: generateRating(),
        reviews: generateReviews(),
        years: generateYears(),
        location: locations[doctorIndex % locations.length],
        nextAvailable: availabilityOptions[doctorIndex % availabilityOptions.length],
        slotsByDay: generateSlotsByDay(),
      });

      doctorIndex++;
    }
  }

  try {
    await db.delete(schema.doctor);
    console.log("🗑️  Cleared existing doctors");

    await db.insert(schema.doctor).values(doctors);
    console.log(`✅ Successfully seeded ${doctors.length} doctors`);

    const specialtyCounts = doctors.reduce((acc, doc) => {
      acc[doc.specialty] = (acc[doc.specialty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log("\n📊 Doctors by specialty:");
    Object.entries(specialtyCounts).forEach(([specialty, count]) => {
      console.log(`   ${specialty}: ${count}`);
    });

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

seed();
