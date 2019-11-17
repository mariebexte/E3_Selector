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
			BufferedWriter bw = new BufferedWriter(new FileWriter(new File("e3_courses.csv")));
			//BNE
			spider.getData("https://campus.uni-due.de/lsf/rds?state=wtree&search=1&trex=step&root120192=238902|234498|234747|234979&P.vx=kurz", bw);
			//IOS Lehrauftrag
			spider.getData("https://campus.uni-due.de/lsf/rds?state=wtree&search=1&trex=step&root120192=238902|234498|234747|236825&P.vx=kurz", bw);
			//Kultur & Gesellschaft
			spider.getData("https://campus.uni-due.de/lsf/rds?state=wtree&search=1&trex=step&root120192=238902|234498|234747|238546&P.vx=kurz", bw);
			//Natur & Technik
			spider.getData("https://campus.uni-due.de/lsf/rds?state=wtree&search=1&trex=step&root120192=238902|234498|234747|236854&P.vx=kurz", bw);
			//Wirtschaft
			spider.getData("https://campus.uni-due.de/lsf/rds?state=wtree&search=1&trex=step&root120192=238902|234498|234747|240080&P.vx=kurz", bw);
			bw.close();
			
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			System.out.println("unable to initialize writer");
			e.printStackTrace();
			System.exit(-1);
		}
	}
}
