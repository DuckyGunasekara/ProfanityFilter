//import 'source-map-support/register';
import * as fs from 'fs';
import * as path from 'path';
import * as filter from 'leo-profanity';

// console.log(filter.list());
// console.log(filter.clean('I have assassin ass'));

var finalList;
let divider = '\r\n';

async function googleWords () {
        
    var inputFile = 'sourcefiles/googleWords.csv'
    let googleInput = fs.readFileSync(inputFile);
   
    var input_whole_val = googleInput.toString().split(divider);

    
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

    finalList = input_whole_val;
    // console.log(input_whole_val);
}


async function writeList () {

    var finalText = '';
    var listCounter = 0, listSize = finalList.length;

    for(listCounter = 0; listCounter < (listSize-1); listCounter++)
    {
        finalText = finalText +  'INSERT INTO `BadWords`(`BadWord`) VALUES ("' + finalList[listCounter]  + '");' +  '\r\n';
    }

    //console.log(finalList[listSize-1]);

    fs.writeFile('outputfiles/spList.csv', finalText, function(Err){
        if(Err) {
            return console.log(Err);
        }
        console.log('Swear file generated in ./outputfiles/');
    });
    

}

googleWords();
writeList();