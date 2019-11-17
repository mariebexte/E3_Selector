import java.io.BufferedWriter;
import java.io.IOException;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Spider {

	//Keeps track of the pages visited by the publishid of courses
	private Set<String> pagesVisited = new HashSet<String>();
	private List<String> pagesToVisit = new LinkedList<String>();
	private SiteHandler handler = new SiteHandler();

	private String nextUrl() {
		String nextUrl="";
		boolean isNew = false;
		while (!isNew) {
			if(!(pagesToVisit.size() > 0))
			{
				return "";
			}
			nextUrl = this.pagesToVisit.remove(0);
			if (!(pagesVisited.contains(getPublishId(nextUrl)))) {
				isNew = true;
			}
		}
		this.pagesVisited.add(getPublishId(nextUrl));
		return nextUrl;
	}

	public void getData(String url, BufferedWriter bw) throws IOException {

		String currentUrl;
		// Get courses linked on this site
		handler.crawl(url);
		this.pagesToVisit.addAll(handler.getLinks());

		while (this.pagesToVisit.size() > 0) {
//		for(int i=0; i<2; i++) {
			currentUrl = this.nextUrl();
			if (!currentUrl.equals("")) {
				handler.extractFields(currentUrl, bw);
			}
		}
	}
	
	public String getPublishId(String url) {
		Pattern p = Pattern.compile("(&publishid=)([0-9]*)(&moduleCall)");
		Matcher m = p.matcher(url);

	    if (m.find()) {
	        return m.group(2); // matched content of second group
	    }else {
	    	return "";
	    }
	}
}
