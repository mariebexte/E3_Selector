import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

public class Main {
	public static void main(String[] args) {
		
		Spider spider = new Spider();
		
		try {
			BufferedWriter bw = new BufferedWriter(new FileWriter(new File("e3_courses_previous.csv")));
			//WS 18/19
			//BNE
			spider.getData("https://campus.uni-due.de/lsf/rds?state=wtree&search=1&trex=step&root120182=215769|208339|209397|216185&P.vx=kurz", "",bw);
			//IOS Lehrauftrag
			spider.getData("https://campus.uni-due.de/lsf/rds?state=wtree&search=1&trex=step&root120182=215769|208339|209397|214815&P.vx=kurz", "",bw);
			//Kultur & Gesellschaft
			spider.getData("https://campus.uni-due.de/lsf/rds?state=wtree&search=1&trex=step&root120182=215769|208339|209397|214349&P.vx=kurz", "",bw);
			//Natur & Technik
			spider.getData("https://campus.uni-due.de/lsf/rds?state=wtree&search=1&trex=step&root120182=215769|208339|209397|213515&P.vx=kurz", "",bw);
			//Wirtschaft
			spider.getData("https://campus.uni-due.de/lsf/rds?state=wtree&search=1&trex=step&root120182=215769|208339|209397|215550&P.vx=kurz", "",bw);
//			
//			Set<String> before = new HashSet<String>();
//			before.addAll(spider.getSiteHandler().getTitles());
//			spider.getSiteHandler().resetTitles();
			
			//SS 19
			//BNE
			spider.getData("https://campus.uni-due.de/lsf/rds?state=wtree&search=1&trex=step&root120191=225759|219530|219741|227171&P.vx=kurz", "",bw);
			//IOS Lehrauftrag
			spider.getData("https://campus.uni-due.de/lsf/rds?state=wtree&search=1&trex=step&root120191=225759|219530|219741|222813&P.vx=kurz", "",bw);
			//Kultur & Gesellschaft
			spider.getData("https://campus.uni-due.de/lsf/rds?state=wtree&search=1&trex=step&root120191=225759|219530|219741|227544&P.vx=kurz", "",bw);
			//Natur & Technik
			spider.getData("https://campus.uni-due.de/lsf/rds?state=wtree&search=1&trex=step&root120191=225759|219530|219741|226184&P.vx=kurz", "",bw);
			//Wirtschaft
			spider.getData("https://campus.uni-due.de/lsf/rds?state=wtree&search=1&trex=step&root120191=225759|219530|219741|228031&P.vx=kurz", "",bw);
	
			Set<String> before = new HashSet<String>();
			before.addAll(spider.getSiteHandler().getTitles());
			spider.getSiteHandler().resetTitles();
			spider.resetVisited();
			
			bw.close();
			//WS 19/20
			bw = new BufferedWriter(new FileWriter(new File("e3_courses.csv")));
			//BNE
			spider.getData("https://campus.uni-due.de/lsf/rds?state=wtree&search=1&trex=step&root120192=238902|234498|234747|234979&P.vx=kurz", "BNE", bw);
			//IOS Lehrauftrag
			spider.getData("https://campus.uni-due.de/lsf/rds?state=wtree&search=1&trex=step&root120192=238902|234498|234747|236825&P.vx=kurz", "IOS", bw);
			//Kultur & Gesellschaft
			spider.getData("https://campus.uni-due.de/lsf/rds?state=wtree&search=1&trex=step&root120192=238902|234498|234747|238546&P.vx=kurz", "Kultur und Gesellschaft",bw);
			//Natur & Technik
			spider.getData("https://campus.uni-due.de/lsf/rds?state=wtree&search=1&trex=step&root120192=238902|234498|234747|236854&P.vx=kurz", "Natur und Technik",bw);
			//Wirtschaft
			spider.getData("https://campus.uni-due.de/lsf/rds?state=wtree&search=1&trex=step&root120192=238902|234498|234747|240080&P.vx=kurz", "Wirtschaft",bw);
			bw.close();
			
			System.out.println("Number of courses in previous semesters: "+before.size());
			
			Set<String> after = spider.getSiteHandler().getTitles();
			System.out.println("Number of courses in WS1920: "+after.size());
			
			after.removeAll(before);
			System.out.println("Number of unique courses in WS1920: "+after.size());
			
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			System.out.println("unable to initialize writer");
			e.printStackTrace();
			System.exit(-1);
		}
	}
}
