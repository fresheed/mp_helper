//global dicts
var tt_dict={
    "":"",
    "РгК, если Z=0": "0000",
    "РгК": "0001",
    "Следующий": "0010",
    "Вектор": "0011",
    "Подпрограмма, если Z=0": "0100",
    "Подпрограмма": "0101",
    "Возврат из подпрограммы": "0110",
    "По стеку": "0111",
    "Зав. цикл, выт. из стека при Z=1": "1000",
    "Загр. стек, продолжить": "1001",
    "Вы. из стека, продолжить": "1010",
    "Зав. цикл, выт. из стека, если С4=1": "1011",
    "РгК, если Z=1": "1100",
    "РгК, если F3=1": "1101",
    "РгК, если OVR=1": "1110",
    "РгК, если C4=1": "1111"
}

var op_dict={
    "":"",
    "R+S+C0": "000",
    "S-R-1+C0": "001",
    "R-S-1+CO": "010",
    "R OR S": "011",
    "R AND S": "100",
    "notR AND S": "101",
    "R XOR S": "110",
    "R EQ S": "111"
}

var source_dict={
    "":"",
    "A ; Q": "000",
    "A ; B": "001",
    "0 ; Q": "010",
    "0 ; B": "011",
    "0 ; A": "100",
    "D ; A": "101",
    "D ; Q": "110",
    "D ; 0": "111"
}

var receiver_dict={
    "":"",
    "F->Q": "000",   
    "no write": "001",   
    "F->Рг(В), Y=A": "010",   
    "F->Рг(В)": "011",   
    "F/2->Рг(В), Q/2->Q": "100",   
    "F/2->Рг(В)": "101",   
    "2F->Рг(В), 2Q->Q": "110",  
    "2F->Рг(В)": "111"
}

var shift_dict={
    "":"",
    "Сдвиг 4разрядный с вводом 0": "00",
    "Циклический 4разрядный": "01",
    "Циклический 8разрядный": "10",
    "Арифметический (+знаковый или 0) 8р": "11"
}

function addRow(tn, i) {

    var table = document.getElementById(tn);

    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);
    var num=row.insertCell();
    num.innerHTML=i;
    makeColumn(row, "trans_address");
    makeDDList(row, "trans_type", tt_dict);
    makeDDList(row, "receiver", receiver_dict);
    makeDDList(row, "operand_source", source_dict);
    makeDDList(row, "alu_function", op_dict);
    makeDDList(row, "shift_type", shift_dict);
    makeColumn(row, "cin");
    makeColumn(row, "A");
    makeColumn(row, "B");
    makeColumn(row, "D");
    makeColumn(row, "comment");
    
/*
    makeColumn(row, "T8", true);
    makeColumn(row, "T7", true);
    makeColumn(row, "T6", true);
    makeColumn(row, "T5", true);
    makeColumn(row, "T4", true);
    makeColumn(row, "T3", true);
    makeColumn(row, "T2", true);
    makeColumn(row, "T1", true);
    makeColumn(row, "T0", true);
*/
}

function makeColumn(row, item_name, dis){
    var cell=row.insertCell();
    var col = document.createElement("input");
    col.type = "text";
    col.name=item_name;
    cell.appendChild(col);
}

function makeDDList(row, item_name, dict){
    var cell=row.insertCell();
    var sel = document.createElement("select");
    cell.appendChild(sel);
    sel.name=item_name;
    for (var key in dict){
	var el = document.createElement("option");
	el.textContent = key;
	el.value = dict[key];
	sel.appendChild(el);
    }
}

function doFill(tn){
  for (i=0; i<15; i++) addRow(tn, i);
}

function dec2bin(dec_num, word_size){
    var bin_num=Number(dec_num).toString(2);
    console.log(bin_num);
    var pad="00000000";
    var ans = pad.substring(0, word_size - bin_num.length) + bin_num;
    return ans;
}

function bin2dec(bin_num){
    return parseInt(bin_num, 2);
}

String.prototype.replaceBetween = function(start, end, what) {
    newstr= this.substring(0, start) + what + this.substring(end+1);
    if (newstr.length != 36){
	alert(newstr);
	}
    return newstr;
}

function getProgram(){
    var table=document.getElementById("dataTable");
    var res_string="###   8    7    6    5    4    3    2    1    0\n";
    for (var i = 1, row; row = table.rows[i]; i++) { //skip headers
	//iterate through rows
	//rows would be accessed using the "row" variable assigned in the for loop
	var command="....................................";
	var comment="";
	for (var j = 1, col; col = row.cells[j]; j++) {//skip num
	    var value=col.childNodes[0].value.toString(2);
	    var name=col.childNodes[0].name;
	    //var value=col.childNodes[0].name;
	    if (!value) value="-";
	    else {
		if (name==="trans_address"){
		    dig8=dec2bin(value, 8);
		    command=command.replaceBetween(0, 7, dig8);
		} else if (name==="trans_type") {		   
		    command=command.replaceBetween(8, 11, value); 
		} else if (name==="receiver") {		   
		    command=command.replaceBetween(13, 15, value); 
		} else if (name==="operand_source") {		   
		    command=command.replaceBetween(17, 19, value); 
		} else if (name==="alu_function") {		   
		    //ошибка в формате!
		    command=command.replaceBetween(21, 23, value); 
		} else if (name==="shift_type"){
		    var d1=value.charAt(0);
		    var d2=value.charAt(1);
		    command=command.replaceBetween(12, 12, d1); 
		    command=command.replaceBetween(16, 16, d2); 
		} else if (name==="cin") {
		    command=command.replaceBetween(20, 20, value);
		} else if (name==="A") {
		    dig4=dec2bin(value, 4);
		    command=command.replaceBetween(24, 27, dig4); 
		} else if (name==="B") {
		    dig4=dec2bin(value, 4);
		    command=command.replaceBetween(28, 31, dig4); 
		} else if (name==="D") {
		    dig4=dec2bin(value, 4);
		    command=command.replaceBetween(32, 35, dig4); 
		} else if (name==="comment") {
		    comment=value;
		}
		console.log(command);
	    }
	    //res_string+=(" "+value);
	}  
	form_string=command.replace(/(.{4})/g,"$1 ")
	res_string+=(addStringNumber(i-1)+": "+form_string+" "+comment+"\n");
    }
    //alert(res_string);
    document.getElementById("res_program").value=res_string;
}

function addStringNumber(num){
    var pad="000";    
    var ans = ""+pad.substring(0, 3 - num.toString(10).length) + num;
    return ans;
}

function loadFromText(){
    var table=document.getElementById("dataTable");
    var source_text=document.getElementById("res_program").value;
    var lines=source_text.split(/\r?\n/);
    var res_string="";
    for (var i = 1, row; row = table.rows[i]; i++) { //skip headers
	//iterate through rows
	//rows would be accessed using the "row" variable assigned in the for loop
	var command=lines[i].substring(5).replace(/\s+/g, '');
	//console.log(command);
	for (var j = 1, col; col = row.cells[j]; j++) { //skip num
	    var cell=col.childNodes[0];
	    var name=col.childNodes[0].name;
	    var to_set="";
	    if (name==="trans_address"){  //substring: from_pos --- to_pos+1
		to_set=bin2dec(command.substring(0, 8));
	    } else if (name==="trans_type") {		  
		to_set=command.substring(8, 12);
	    } else if (name==="receiver") {
		to_set=command.substring(13, 16);
	    } else if (name==="operand_source") {
		to_set=command.substring(17, 20);
	    } else if (name==="shift_type") {
		to_set=command.substring(12,13)+command.substring(16,17);
	    } else if (name==="cin") {
		to_set=command.substring(20,21);
	    } else if (name==="alu_function") {		   
		to_set=command.substring(21, 24);
	    } else if (name==="A") {
		to_set=bin2dec(command.substring(24, 28)); 
	    } else if (name==="B") {
		to_set=bin2dec(command.substring(28, 32));
	    } else if (name==="D") {
		to_set=bin2dec(command.substring(32, 36));
	    } else if (name==="comment") {
		to_set=command.substring(36);
	    }
	    
	    if (to_set || to_set==0) cell.value=to_set;
	}  

    }
}

