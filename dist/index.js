"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const cheerio = __importStar(require("cheerio"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ override: true });
const email_1 = require("./email");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: [
        "chrome-extension://idlieogljpnggcplmahhkflpbadikmkm"
    ],
    methods: ["POST", "GET"],
}));
const urls = [
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
    const found = [];
    for (const url of urls) {
        try {
            console.log("Launching Puppeteer...");
            const browser = await puppeteer_1.default.launch({
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
                console.log("=================", titleAnchor, linkHref, titleText);
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
        }
        catch (err) {
            console.error("Failed to fetch with Puppeteer for:", url, err);
        }
    }
    if (found.length > 0) {
        const emailText = found
            .map((f) => `${f.title}\n${f.matchedUrl}`)
            .join("\n\n");
        const result = await (0, email_1.sendEmail)({
            to: "mdfardinkhan1952@gmail.com",
            subject: "New Courses Found 🔍",
            text: emailText,
        });
        console.log("📩 Email Sent:", result);
    }
    else {
        console.log("⚠️ No courses found during this crawl.");
    }
    console.log("Crawl completed.");
}
app.post("/trigger-crawl", async (req, res) => {
    await crawlSites();
    res.json({ success: true });
});
app.listen(4000, () => console.log("Crawler running on port 4000"));
