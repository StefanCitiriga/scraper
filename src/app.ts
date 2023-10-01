import express from 'express';
import cors from 'cors'
import { getSentiment } from './sentiment-analysis';
import cheerio from 'cheerio';
import axios from 'axios';


const app = express();
app.use(express.json());
app.use(
    cors({
        origin:'http://localhost:3000'
    })
)
app.listen(4000, () => console.log("App is running on http://localhost:4000"));
app.get('/health', (req,res) =>res.send(200));
app.post('/api/sentiment', (req,res) =>{
    const data=req.body.data;

    const sentiment = getSentiment(data);

    return res.send({sentiment});
})

// Function to count words in a given text
function countWords(text: string): number {
    const words = text.trim().split(/\s+/);
    return words.length;
}

app.get('/wordcount', async (req, res) => {
    try {
        const { url } = req.query as {url?: string};

        if (!url) {
            return res.status(400).json({ error: 'URL parameter is required' });
        }

        // Fetch the HTML content of the blog post
        const response = await axios.get(url);
        const html = response.data;

        // Load HTML content into Cheerio
        const $ = cheerio.load(html);

        // Extract the text content of the blog post
        let blogContent = '';//$('body').text();
        const potentialContainers = ['article','div','.content', '#main'];

        // Try to find the content in potential containers
        for (const container of potentialContainers) {
            blogContent = $(container).text().trim();
            if (blogContent) {
                break;
            }
        }

        // If no content is found, consider the whole body
        if (!blogContent) {
            blogContent = $('body').text().trim();
        }
        console.log(blogContent);
        // Calculate word count
        const wordCount = countWords(blogContent);

        // Respond with the result
        res.json({ wordCount });
    } catch (error: any) {
        console.error('Error:', (error as Error).message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/scrape', async (req, res) => {
    try {
      const { url, elements } = req.body;
  
      // Send a request to the URL and get the HTML content
      const response = await axios.get(url);
      
      // Load HTML content using Cheerio
      const $ = cheerio.load(response.data);
      
      // Extract specified elements
      const scrapedData: any = {};
      console.log(scrapedData);
      if (elements.includes('h3')) {
        scrapedData.headings = [];
        $('h3').each((index, element) => {
          scrapedData.headings.push($(element).text());
        });
      }
      
      if (elements.includes('p')) {
        scrapedData.paragraphs = [];
        $('p').each((index, element) => {
          scrapedData.paragraphs.push($(element).text());
        });
      }
  
      if (elements.includes('img')) {
        scrapedData.images = [];
        $('img').each((index, element) => {
          scrapedData.images.push($(element).attr('src'));
        });
      }
  
      if (elements.includes('a')) {
        scrapedData.links = [];
        $('a').each((index, element) => {
          scrapedData.links.push({
            text: $(element).text(),
            href: $(element).attr('href'),
          });
        });
      }
  
      // Return the scraped data in JSON format
      res.json(scrapedData);
      console.log(elements);
    } catch (error) {
      // Handle errors and return an error message
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });