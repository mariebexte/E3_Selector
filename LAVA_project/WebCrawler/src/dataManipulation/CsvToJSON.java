package dataManipulation;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Reader;
import java.util.ArrayList;
import java.util.Map;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;

public class CsvToJSON {
	
	public static void main(String[] args) throws IOException {
		
		BufferedReader br = new BufferedReader(new FileReader(new File("e3_courses_FINAL.csv")));
		BufferedWriter bw = new BufferedWriter(new FileWriter(new File("e3_courses.json")));
		
		String line = br.readLine();
		String[] entries;
		String prevCatalog = "";
		String catalog;
		
//		while(br.ready()) {
//			line = br.readLine();
//			entries = line.split(",");
//			catalog = entries[3];
//			
//			System.out.println("LINE: "+line);
//			System.out.println("CAT: "+catalog);
//		}
		
	    Reader in = new FileReader("e3_courses_withoutTextParagraphs.csv");
	    Iterable<CSVRecord> records = CSVFormat.DEFAULT
//	      .withHeader(HEADERS)
	      .withFirstRecordAsHeader()
	      .parse(in);
	    
	    Map<String, String> courseMap;
	    
	    bw.write("{\"title\":\"E3 Courses\",\"children\":[");
	    
	    for (CSVRecord record : records) {	    	
	    	
	        catalog = record.get("catalog");
	        
	        if(!catalog.contentEquals(prevCatalog)) {
	        	
	        	if(!prevCatalog.contentEquals("")) {
	        		bw.write("}]},");
	        		bw.newLine();
	        	}
	        	
//				System.out.println("LINE: "+record);
//				System.out.println("CAT: "+catalog);
				
				bw.write("{\"title\":\""+catalog+"\",\"children\":[");
	        	
	        }
	        else {
		        bw.write("},");
		        bw.newLine();
	        }
	        
	        courseMap = record.toMap();
	        
	        bw.write("{");
	        
	        ArrayList<String> keys = new ArrayList<String>();
	        keys.addAll(courseMap.keySet());
	        
	        for(int i = 0; i<keys.size()-1; i++) {
	        	
	        	String key = keys.get(i);
	        	bw.write("\""+key+"\":\""+courseMap.get(key)+"\",");
	        	
	        }
	        
        	String key = keys.get(keys.size()-1);
        	bw.write("\""+key+"\":\""+courseMap.get(key)+"\"");
			
			prevCatalog = catalog;
	    }
	    
		bw.write("}]}]}");
		bw.close();
		br.close();
		
	}

}
