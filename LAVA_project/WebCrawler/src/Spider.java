import java.io.BufferedWriter;
import java.io.IOException;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

public class Spider {
	
	private Set<String> pagesVisited = new HashSet<String>();
	private List<String> pagesToVisit = new LinkedList<String>();
	private SiteHandler handler = new SiteHandler();

	private String nextUrl() {
		String nextUrl;
		// get first entry of pages to visit
		// make sure it was not already visited
		do {
			try {
			nextUrl = this.pagesToVisit.remove(0);
			}
			catch(IndexOutOfBoundsException e) {
				return "";
			}

		} while (this.pagesVisited.contains(nextUrl));
		this.pagesVisited.add(nextUrl);
		return nextUrl;
	}

	public void getData(String url, BufferedWriter bw) throws IOException {

		String currentUrl;
		// in the beginning, no pages have been queued
		this.pagesVisited.add(url);
		handler.crawl(url);
		this.pagesToVisit.addAll(handler.getLinks());
		
		while (this.pagesToVisit.size() > 0) {
//		for(int i=0; i<2; i++) {
			currentUrl = this.nextUrl();
			if(!currentUrl.equals("")) {
				handler.extractFields(currentUrl,bw);
			}
		}
	}
}
