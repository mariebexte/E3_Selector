package postProcessing;

import java.io.FileReader;
import java.io.File;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Reader;
import java.util.ArrayList;
import java.util.Map;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;

public class CsvToJson  {
    
    public static void main(String[] args) {
        
        try{
            process("e3_courses_190120_2.csv","e3_courses_190120_2.json");
        }
        catch(IOException e){
            e.printStackTrace();
            System.err.println("File not found.");
        }
    }
	
	public static void process(String pathIn, String pathOut) throws IOException {
		
		BufferedWriter bw = new BufferedWriter(new FileWriter(new File(pathOut)));
		
		String prevCatalog = "";
		String catalog;
		
	    Reader in = new FileReader(pathIn);
	    Iterable<CSVRecord> records = CSVFormat.DEFAULT
	      .withFirstRecordAsHeader()
	      .parse(in);
	    
	    Map<String, String> courseMap;
	    
	    bw.write("{\"title\":\" \",\"children\":[");
	    
	    for (CSVRecord record : records) {	    	
	    	
	        catalog = record.get("catalog");
	        
	        if(!catalog.contentEquals(prevCatalog)) {
	        	
	        	if(!prevCatalog.contentEquals("")) {
	        		bw.write("}]},");
	        		bw.newLine();
	        	}
				
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
		in.close();	
	}

}
