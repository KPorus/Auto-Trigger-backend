import express, { Request, Response } from "express";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ override: true });
import { sendEmail } from "./email";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: [
      "chrome-extension://idlieogljpnggcplmahhkflpbadikmkm"
    ],
    methods: ["POST", "GET"],
  })
);


const urls: string[] = [
  //   "https://medium.com/tag/n8n",
  //   "https://news.ycombinator.com/",
  //   "https://reddit.com/r/selfhosted",
  //   "https://github.com/topics/n8n"
  "https://courspora.my.id/course",
  // "https://medium.com/tag/n8n",
];

// const transporter = nodemailer.createTransport({
//     service: "Gmail",
//     auth: {
//         user: "your_email@gmail.com",
//         pass: "your_app_password"
//     }
// });

// async function crawlSites() {
//   const found: { title: string; matchedUrl: string }[] = [];

//   for (const url of urls) {
//     try {
//       const { data } = await axios.get(url, { timeout: 10000 });
//       const $ = cheerio.load(data);
      
//       const text = $.html();
//       console.log(text);
//       // Find all <a> tags, check if they contain the keyword in text or href
//       //   $("a").each((_, elem) => {
//       //     const linkText = $(elem).text().toLowerCase();
//       //     const linkHref = $(elem).attr("href");
//       //     console.log(linkHref, linkText);
//       //     // if ((linkText.includes("Product") || (linkHref && linkHref.toLowerCase().includes("Product"))) && linkHref) {
//       //     //   // Make absolute if it's a relative URL
//       //     //   const matchedUrl = linkHref.startsWith("http")
//       //     //     ? linkHref
//       //     //     : new URL(linkHref, url).toString();

//       //     //   found.push({
//       //     //     title: $(elem).text().trim(),
//       //     //     matchedUrl
//       //     //   });
//       //     // }

//       //     if (linkHref && linkHref.startsWith("/course/")) {
//       //       const matchedUrl = linkHref.startsWith("http")
//       //         ? linkHref
//       //         : new URL(linkHref, url).toString();

//       //       found.push({
//       //         title: $(elem).text().trim(),
//       //         matchedUrl,
//       //       });
//       //     }
//       //   });

//       $("ul").each((_, ul) => {
//         console.log("url");
//         $(ul)
//           .find("li")
//           .each((_, li) => {
//             // Look for all anchor tags inside this li (often first <a> is course image, second is title)
//             $(li)
//               .find("a")
//               .each((__, a) => {
//                 const linkHref = $(a).attr("href");
//                 const titleText = $(a).text().trim();
//                 console.log(linkHref, titleText);
//                 // Only add valid course links:
//                 if (linkHref) {
//                   const matchedUrl = new URL(linkHref, url).toString();
//                   found.push({
//                     title: titleText,
//                     matchedUrl,
//                   });
//                 }
//               });
//           });
//       });
//     } catch (err) {
//       console.log("Failed to fetch:", url);
//     }
//   }

//   if (found.length > 0) {
//     const emailText = found
//       .map((f) => `${f.title}\n${f.matchedUrl}`)
//       .join("\n\n");

//     const result = await sendEmail({
//       to: "mdfardinkhan1952@gmail.com",
//       subject: "Python Content Detected 🔍",
//       text: emailText,
//     });

//     console.log(result);
//   }

//   console.log("Crawl completed");
// }


async function crawlSites() {
  const found: { title: string; matchedUrl: string }[] = [];

  for (const url of urls) {
    try {
      console.log("Launching Puppeteer...");
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      const page = await browser.newPage();

      console.log("Visiting:", url);
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

      // Wait for content to render (adjust selector if needed)
      await page.waitForSelector("ul", { timeout: 30000 });

      const html = await page.content();
      const $ = cheerio.load(html);

      console.log("✅ Page loaded, extracting course data...");
      console.log(html);

      // Extract specific course title + link
      $("ul.gap-2.space-y-2.sm\\:space-y-0.sm\\:grid.sm\\:grid-cols-2.lg\\:grid-cols-3 > li").each((_, li) => {
        const titleAnchor = $(li).find("a.font-bold.line-clamp-2");
        const linkHref = titleAnchor.attr("href");
        const titleText = titleAnchor.text().trim();
        console.log("=================",titleAnchor,linkHref,titleText);

        if (linkHref && titleText.length > 0) {
          const matchedUrl = new URL(linkHref, url).toString();
          found.push({
            title: titleText,
            matchedUrl,
          });
        }
      });

      console.log(`✅ Extracted ${found.length} courses.`);

      await browser.close();
    } catch (err) {
      console.error("Failed to fetch with Puppeteer for:", url, err);
    }
  }

  if (found.length > 0) {
    const emailText = found
      .map((f) => `${f.title}\n${f.matchedUrl}`)
      .join("\n\n");

    const result = await sendEmail({
      to: "mdfardinkhan1952@gmail.com",
      subject: "New Courses Found 🔍",
      text: emailText,
    });

    console.log("📩 Email Sent:", result);
  } else {
    console.log("⚠️ No courses found during this crawl.");
  }

  console.log("Crawl completed.");
}

app.post("/trigger-crawl", async (req: Request, res: Response) => {
  await crawlSites();
  res.json({ success: true });
});

app.listen(4000, () => console.log("Crawler running on port 4000"));
