// import { NUMBER_OF_SAMPLE_DATA } from "../constants";
import { db } from "../src/server/db";
import { faker } from "@faker-js/faker";

async function main () {
    const isDataExist = await db.category.count();

    if (isDataExist) {
        console.log("Data already exist, don't need to be created.");
        return;
    }

    for (let i = 0; i< 100; i++) {
        const category = faker.commerce.productName();
        await db.category.create({
            data: {
                name: category
            }
        });
    }
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });

