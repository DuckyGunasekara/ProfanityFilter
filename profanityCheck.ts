//---------------------------------------------------------------------------------------------------------
//Imports
import * as fs from 'fs';
import * as path from 'path';
import * as filter from 'leo-profanity';
//---------------------------------------------------------------------------------------------------------
//Variables
var swearArray = [];
//---------------------------------------------------------------------------------------------------------
//Functions
//This function reads data from a csv file and stores all bad words in an array
async function readFromCSV()
{    
    let divider = '\r\n';

    var inputFile = 'sourcefiles/googleWords.csv'
    let fileData = fs.readFileSync(inputFile);
    var input_whole_val = fileData.toString().split(divider);

    for (var x = 0; x<input_whole_val.length; x++)
    {
        for(var y = 0; y<input_whole_val[x].length; y++)
        {
            if(input_whole_val[x].lastIndexOf(' ') == (input_whole_val[x].length-1))
            {
                input_whole_val[x] = input_whole_val[x].slice(0,(input_whole_val[x].length-1));
            }
        }
    }
    swearArray = input_whole_val;
    return swearArray;
}
//---------------------------------------------------------------------------------------------------------
//This function cleans input data
//npm package
function filterData(inputData)
{
    filter.add(swearArray);
    var cleanText = filter.clean(inputData);
    console.log("filterData Function \n" + cleanText + "\n");
}
//---------------------------------------------------------------------------------------------------------
//This function cleans the input data
function getCleanData(inputData,profanityArray)
{
    let cleanData = "";
    let dataBuffer = "";
    let i = 0;
    let found;

    //Put each word of the input text into a buffer
    while(i < inputData.length)
    {
        if(inputData.charAt(i) != " ")
        {
            dataBuffer = dataBuffer + inputData.charAt(i);
            i++;   
        }
        
        if(inputData.charAt(i) == " " || i >= inputData.length)
        {
            if(cleanData.length > 0)
            {
                cleanData = cleanData + " ";
            }  
            i++;

            //Put each word of the input text into a buffer
            dataBuffer = getCleanWord(dataBuffer,profanityArray);
            
            //Clean the word in the buffer using advanved techniques
            dataBuffer = specialCase(dataBuffer,profanityArray);

            //If part of a word has a * then the whole word is concidered bad and is replaced with stars
            found = dataBuffer.indexOf("*");
            for(let j = 0 ; j < dataBuffer.length ; j++)
            {
                if(found >= 0)
                {
                    cleanData = cleanData + "*";
                }
                else
                {
                    cleanData = cleanData + dataBuffer.charAt(j);
                }
            }
            dataBuffer = "";
        }
    }
    console.log("getCleanData Function \n" + cleanData + "\n");
    return cleanData;
}
//---------------------------------------------------------------------------------------------------------
//This function attepts to clean a word using the database and returns the possibly clean word
//Used in getCleanData(inputData,profanityArray)
function getCleanWord(inputWord, profanityArray) 
{
    //Change word to lowercase in order to compare to database data
    let inputWordCopy = inputWord.toLowerCase();
    
    let swearPosition;
    let complete = 0;
    
    //Iterate through the array of bad words
    for (let i = 0 ; i < profanityArray.length ; i++) 
    {
        //Determine whether the input matches a bad word in the array
        swearPosition = inputWordCopy.indexOf(profanityArray[i]);
        if (swearPosition >= 0) 
        {
            //If there is a match replace the word with stars and return the clean word
            inputWordCopy = inputWordCopy.replace(profanityArray[i], getStars(profanityArray[i].length));
            return inputWordCopy;
        }
    }
    //If the input is clean return it as is
    return inputWordCopy;
}
//---------------------------------------------------------------------------------------------------------
//This function returns the correct number of stars to replace the profanity with 
//Used in getCleanWord(inputWord, profanityArray)
function getStars(numStars)
{
    let stars = "";
    for (let i = 0; i < numStars; i++) 
    {
        stars = stars + "*";
    }
    return stars;
}
//---------------------------------------------------------------------------------------------------------
//This function uses different techniques to catch profanity
function specialCase(data,profanityArray)
{
   let temp = "";
   let badWord = 0; 

   //Iterate through a word and replace certain profanity avoidance characters
   for(let i = 0 ; i < data.length ; i++)
   {
        switch(data.charAt(i))
        {
            case '0':
                temp = temp + "o";
                break;

            case '1':
                temp = temp + "i";
                break;
                
            case '3':
                temp = temp + "e";
                break;

            case '4':
                temp = temp + "a";
                break;
            
            case '5':
                temp = temp + "s";
                break;

            case '@':
                temp = temp + "a";
                break;

            default:
                temp = temp + data.charAt(i);    
        }
   } 

    //Attempt to clean the word
    temp = getCleanWord(temp,profanityArray);

    //If the word is bad it will contain a *
    let i = 0;
    while(i < temp.length && badWord == 0)
    {
        if(temp.charAt(i) == "*")
        {
            badWord = 1; 
        }
        i++
    }
   
    //If bad return the clean word else return the original word
    if(badWord == 1)
    {
        return temp;
    }
    else
    {
        return data;
    }
}
//---------------------------------------------------------------------------------------------------------
//Execution
var someText = "b1tch shit ass Assassin a55 town yes HI";

readFromCSV();

//npm package filter
//filterData(someText);

//Attempted filter
getCleanData(someText,swearArray);
//---------------------------------------------------------------------------------------------------------
