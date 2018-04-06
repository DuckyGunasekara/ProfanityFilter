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
}
//---------------------------------------------------------------------------------------------------------
function filterData(inputData)
{
    var cleanText = filter.clean(inputData);
    console.log("filterData Function \n" + cleanText + "\n");
}
//---------------------------------------------------------------------------------------------------------
function filterData2(inputData, profanityArray) 
{
    var cleanData = getCleanData(inputData, profanityArray)
    console.log("filterData2 Function 1 \n" + cleanData + "\n");
}
//---------------------------------------------------------------------------------------------------------
function getCleanWord(inputWord, profanityArray) 
{
    let inputWordCopy = inputWord.toLowerCase();
    
    let swearPosition;
    let complete = 0;
    
    for (let i = 0 ; i < profanityArray.length ; i++) 
    {
        swearPosition = inputWordCopy.indexOf(profanityArray[i]);
        if (swearPosition >= 0) 
        {
            inputWordCopy = inputWordCopy.replace(profanityArray[i], getStars(profanityArray[i].length));
            return inputWordCopy;
        }
    }
    return inputWordCopy;
}
//---------------------------------------------------------------------------------------------------------
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
function getCleanData(inputData,profanityArray)
{
    let cleanData = "";
    let dataBuffer = "";
    let dataBufferCopy = "";
    let i = 0;
    let found;

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

            dataBuffer = getCleanWord(dataBuffer,profanityArray);
            dataBufferCopy = dataBuffer;




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
    return cleanData;
}
//---------------------------------------------------------------------------------------------------------
function specialCase(data,profanityArray)
{
   let dataClean = "";

   for(let i = 0 ; i < data.length ; i++)
   {
        switch(data.charAt(i))
        {
            case 0:
                dataClean = dataClean + "o";
                break;
        }
   } 
   console.log(dataClean);
   return dataClean;
}
//---------------------------------------------------------------------------------------------------------
//Execution
var someText = "TO THE the MRbitches FaceFuck-- assassins B00B boobs fu-ck";
var someText2 = "TO THE the MRbitches FaceFuck-- assassins B00B boobs fu-ck";

readFromCSV();
filter.add(swearArray);
filterData(someText);
filterData2(someText2,swearArray);
//---------------------------------------------------------------------------------------------------------
