// @ts-ignore
import aposToLexForm from "apos-to-lex-form";
import { WordTokenizer, SentimentAnalyzer, PorterStemmer } from "natural";
// @ts-ignore
import SpellCorrector from "spelling-corrector";
import stopword from "stopword";

const tokenizer = new WordTokenizer();
const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();
const analyzer = new SentimentAnalyzer('English', PorterStemmer, "afinn");

export function getSentiment(str: string): -1|0|1 {
    if(!str.trim()){
        return 0;
    }

    //Change mispelled words and shortened version of words to lexic form.
    const lexed = aposToLexForm(str).toLowerCase().replace(/[^a-zA-Z\s]+/g, "");
    
    //Tokenize the string
    const tokenized = tokenizer.tokenize(lexed);

    //
    if (tokenized===null) return 0;
    else
    {
    const fixedSpelling = tokenized.map((word) => spellCorrector.correct(word));
    
    const analyzed = analyzer.getSentiment(fixedSpelling);

    if(analyzed>=1) return 1;
    else if(analyzed<1 && analyzed>-1) return 0;
    return -1;
    }
}
