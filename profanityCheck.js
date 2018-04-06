"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
//---------------------------------------------------------------------------------------------------------
//Imports
var fs = require("fs");
var filter = require("leo-profanity");
//---------------------------------------------------------------------------------------------------------
//Variables
var swearArray = [];
//---------------------------------------------------------------------------------------------------------
//Functions
//This function reads data from a csv file and stores all bad words in an array
function readFromCSV() {
    return __awaiter(this, void 0, void 0, function () {
        var divider, inputFile, fileData, input_whole_val, x, y;
        return __generator(this, function (_a) {
            divider = '\r\n';
            inputFile = 'sourcefiles/googleWords.csv';
            fileData = fs.readFileSync(inputFile);
            input_whole_val = fileData.toString().split(divider);
            for (x = 0; x < input_whole_val.length; x++) {
                for (y = 0; y < input_whole_val[x].length; y++) {
                    if (input_whole_val[x].lastIndexOf(' ') == (input_whole_val[x].length - 1)) {
                        input_whole_val[x] = input_whole_val[x].slice(0, (input_whole_val[x].length - 1));
                    }
                }
            }
            swearArray = input_whole_val;
            return [2 /*return*/, swearArray];
        });
    });
}
//---------------------------------------------------------------------------------------------------------
//This function cleans input data
//npm package
function filterData(inputData) {
    filter.add(swearArray);
    var cleanText = filter.clean(inputData);
    console.log("filterData Function \n" + cleanText + "\n");
}
//---------------------------------------------------------------------------------------------------------
//This function cleans the input data
function getCleanData(inputData, profanityArray) {
    var cleanData = "";
    var dataBuffer = "";
    var i = 0;
    var found;
    //Put each word of the input text into a buffer
    while (i < inputData.length) {
        if (inputData.charAt(i) != " ") {
            dataBuffer = dataBuffer + inputData.charAt(i);
            i++;
        }
        if (inputData.charAt(i) == " " || i >= inputData.length) {
            if (cleanData.length > 0) {
                cleanData = cleanData + " ";
            }
            i++;
            //Put each word of the input text into a buffer
            dataBuffer = getCleanWord(dataBuffer, profanityArray);
            //Clean the word in the buffer using advanved techniques
            dataBuffer = specialCase(dataBuffer, profanityArray);
            //If part of a word has a * then the whole word is concidered bad and is replaced with stars
            found = dataBuffer.indexOf("*");
            for (var j = 0; j < dataBuffer.length; j++) {
                if (found >= 0) {
                    cleanData = cleanData + "*";
                }
                else {
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
function getCleanWord(inputWord, profanityArray) {
    //Change word to lowercase in order to compare to database data
    var inputWordCopy = inputWord.toLowerCase();
    var swearPosition;
    var complete = 0;
    //Iterate through the array of bad words
    for (var i = 0; i < profanityArray.length; i++) {
        //Determine whether the input matches a bad word in the array
        swearPosition = inputWordCopy.indexOf(profanityArray[i]);
        if (swearPosition >= 0) {
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
function getStars(numStars) {
    var stars = "";
    for (var i = 0; i < numStars; i++) {
        stars = stars + "*";
    }
    return stars;
}
//---------------------------------------------------------------------------------------------------------
//This function uses different techniques to catch profanity
function specialCase(data, profanityArray) {
    var temp = "";
    var badWord = 0;
    //Iterate through a word and replace certain profanity avoidance characters
    for (var i_1 = 0; i_1 < data.length; i_1++) {
        switch (data.charAt(i_1)) {
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
                temp = temp + data.charAt(i_1);
        }
    }
    //Attempt to clean the word
    temp = getCleanWord(temp, profanityArray);
    //If the word is bad it will contain a *
    var i = 0;
    while (i < temp.length && badWord == 0) {
        if (temp.charAt(i) == "*") {
            badWord = 1;
        }
        i++;
    }
    //If bad return the clean word else return the original word
    if (badWord == 1) {
        return temp;
    }
    else {
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
getCleanData(someText, swearArray);
//---------------------------------------------------------------------------------------------------------
