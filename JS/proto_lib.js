console.log("Welcome to The Library");

// initializing check button, books in library, searchbar and form on reloading
document.getElementById("fiction").checked= true;
document.getElementById("libform").reset();
document.getElementById("searchtxt").value="";
showbooks();


function Book(name, author, type){   //creating a constructor book for creating a book object
    this.name=name;  this.author=author;  this.type=type;
}

function Display(){  //creating a display constructor which will contain certain elements to display books in table

}

//adding method to display prototype
Display.prototype.clear= function(){  //function to clear the form after submiting it
    let libform=document.getElementById("libform");
    libform.reset();  //calling the reset function which takes the element to original state
}
Display.prototype.validate= function(book){  //function to check if book entered is valid or not
    if(book.name.length<2 || book.author.length<2){ return false; }
    else{ return true; }
}
Display.prototype.showmessage= function(type, displaymessage){  //function show messages 
    let message=document.getElementById("message");
    let txt=(type==="success")? "Success" : "Error" ;  //using ternary operator
    message.innerHTML=`
                        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                            <strong>${txt}:</strong> ${displaymessage}
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
    `;
    setTimeout(() => {
        message.innerHTML="";  //deleting message after particular time
    }, 4000);  //adding a timeout after 4000 millisec = 4sec
}

//feature to open text box on selection of others radio button
let radio=document.getElementsByClassName("form-check-input");  //selecting radio buttons class(all buttons)
Array.from(radio).forEach( function(index){  //traversing each button as array
    let radio_button_id=index.id;  //copying id of button in var as string
    // console.log(radio_button_id);
    document.getElementById(radio_button_id).onclick= function(){
        if(radio_button_id==="fiction" || radio_button_id==="programming" || radio_button_id==="science"){
            document.getElementById("othertypebox").style.display="none";
        }
        else{ document.getElementById("othertypebox").style.display="block";}
    }
});

//adding event listner to addbook button(type submit) of form
let libform=document.getElementById("libform");
libform.addEventListener("submit", libformsubmit);

function libformsubmit(e){
    console.log("Book added");
    let bookname=document.getElementById("bookname").value;
    let author=document.getElementById("author").value;
    let type;
    //for type
    let fiction=document.getElementById("fiction");
    let programming=document.getElementById("programming");
    let science=document.getElementById("science");
    let others=document.getElementById("others");

    if(fiction.checked){ type=fiction.value; }
    else if(programming.checked){ type=programming.value; }
    else if(science.checked){ type=science.value; }
    else{
        let types_box=document.getElementById("other_types");  //retreving search box of others -radio button
        type=types_box.value;
    }

    let book=new Book(bookname, author, type);  //creating a book object
    // console.log(book);  //for our convience checking resutls

    //add and clear display functions calling
    let display=new Display();
    if(display.validate(book)){  //calling validate function to check if book entered is valid or not
        //storing data into local storage
        let books=localStorage.getItem("books");  //searching localstorage for item books
        if(books==null){ booksobj=[]; }  //if nothing in localstorage then creating an booksobj array
        else{ booksobj= JSON.parse(books); } //returning whole array
        let book_object={
            bname: bookname,
            bauthor: author,
            btype: type
        };   
        booksobj.push(book_object); //pushing object to our array
        localStorage.setItem("books",JSON.stringify(booksobj)); //setting item as a string with key notes

        showbooks();  //calling function to showbooks as new book added in localstorage
        document.getElementById("othertypebox").style.display="none"; //setting display to none of type_box ,after submit button clicked
        display.clear();   //calling function to clear the form after submiting the form
        display.showmessage("success", "Book Added Successfully!!"); //calling showmessage function as success; green message
    }
    else{ display.showmessage("danger", "Please Enter Valid Entries"); } //calling showmessage function as danger; red message

    e.preventDefault();  //preventing the default action of the form as form auto submits on clicking submit button
}

function showbooks(){  //function to showbooks
    let books=localStorage.getItem("books");  //retreving notes
    if(books==null){ booksobj=[]; }
    else{ booksobj= JSON.parse(books); }

    let tableele=``;  //creating blank string
    booksobj.forEach(function(element,index){  //traversing booksobj
    tableele+=`
                <tr class="book_details">
                <td>${element.bname}</td>
                <td>${element.bauthor}</td>
                <td>${element.btype}</td>
                <td><button class="delbtn btn btn-primary" id="${index}" onclick="removebook(this.id)"
                     style="width:30px; height:30px; padding:1px;">-</button></td>
                </tr>
        `;
    });
    let tablebody=document.getElementById("table_body");
    if(booksobj.length!=0){ tablebody.innerHTML=tableele; }
    else{ tablebody.innerHTML=`No Books Available`;}
}

//creating function to remove a book, for which we have made some changes in delete button we add id part and onclick 
//attribute which on clicking the button will call removebook function for that button id
function removebook(index){
    let books=localStorage.getItem("books");  //retreving books
    if(books==null){ booksobj=[]; }
    else{ booksobj= JSON.parse(books); }  //converting string to array/object

    /*The splice() method changes the contents of an array by removing or replacing existing elements and/or adding new elements
    splice(start)
    splice(start, deleteCount)
    splice(start, deleteCount, item1)
    splice(start, deleteCount, item1, item2, itemN)
    */
    booksobj.splice(index, 1);  //this function will delete the note but we also have to update the localstorage
    localStorage.setItem("books",JSON.stringify(booksobj)); //updating local storage
    showbooks(); //showing updated notes
}

//searching function (navbar) for sorting notes on the basis of text inputed
let search=document.getElementById("searchtxt");  //selecting inputing tag
search.addEventListener("input", function(){
    // console.log("input event used");
    let inputval=search.value.toLowerCase();  //lowercase function will convert uppercase inputed text into lowercase
    let book_details=document.getElementsByClassName("book_details");  //selecting table row
    Array.from(book_details).forEach(function(element){
        let Bname=element.getElementsByTagName("td")[0].innerText.toLowerCase();  //searching name
        let Bauthor=element.getElementsByTagName("td")[1].innerText.toLowerCase();  //searching author
        let Btype=element.getElementsByTagName("td")[2].innerText.toLowerCase();  //searching type
        //base condition for searching as now we have retreived card text
        if(Bname.includes(inputval) || Bauthor.includes(inputval) || Btype.includes(inputval)){
            element.style.visibility= "revert";  //changing css
        }
        else{ element.style.visibility= "collapse"; }
    });
});

//preventing default action of searchbtn
let searchbtn=document.getElementById("searchbtn");
searchbtn.addEventListener("click", (e)=>{e.preventDefault();});