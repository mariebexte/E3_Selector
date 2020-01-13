import java.io.BufferedWriter;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class SiteHandler {

	private static final String USER_AGENT = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/13.0.782.112 Safari/535.1";
	private List<String> links;
	private Document htmlDocument;

	private Set<String> distinctCourses = new HashSet<String>();
	private Set<String> courseBase = new HashSet<String>();

	private boolean wroteColumnHeaders = false;

	// Crawl all courses linked on a page
	public void crawl(String url) {
		links = new LinkedList<String>();
		boolean success = retrieveDocument(url);

		if (success) {
			Elements linksOnPage = htmlDocument.select("a[href]");
			System.out.println("Found (" + linksOnPage.size() + ") links");
			for (Element link : linksOnPage) {
				if (link.absUrl("href").endsWith("veranstaltung")) {
					this.links.add(link.absUrl("href"));
					System.out.println(link.absUrl("href"));
				}
			}
		} else {
			System.err.println("Document retrieval failed!");
			System.exit(-1);
		}
	}

	// Get all links found on a page
	public List<String> getLinks() {
		System.out.println("Found " + links.size() + " links");
		return this.links;
	}

	// Extract data about a course
	public void extractFields(String url, String catalog, BufferedWriter bw) throws IOException {
		retrieveDocument(url);

		if (!wroteColumnHeaders) {
			//include links to courses
			bw.write("link,");
			
			// First column will hold the title of a course
			bw.write("title,");
			
			bw.write("catalog,");

			// Extract column names:
			Elements el = htmlDocument.getElementsByClass("mod");
			for (Element ele : el) {
				bw.write("\"" + cleanText(ele.text()) + "\"" + ",");
			}

			bw.write("isReoccurring");

			bw.newLine();
			wroteColumnHeaders = true;
		}
		
		// Write lsf url
		bw.write("\""+url+"\",");

		// Extract the title
		Elements elements = htmlDocument.getElementsByTag("title");
		String title = elements.text();

		title = title.replaceAll("- .*?: .*? - .*? - ", "");
		// Title is ill-formatted; need to match again
		if (!title.contains(" - ")) {
			title = elements.text();
			title = title.replaceAll("- .*?: ", "");
			title = title.replaceAll(" - .?.?.? Cr\\..*[\\n\\r]?.*", "");
		} else {
			title = title.replaceAll(" -.? Cr\\..*[\\n\\r]?.*", "");
		}

		if (!title.contains("Klausuranmeldung") && !title.contains("ENTFÄLLT")) {

			bw.write("\"" + cleanText(title));
			bw.write("\",\"" + catalog);
			distinctCourses.add(title);

			// Need to explicitly test these classes as some courses are missing some of
			// them
			List<String> basicFields = Arrays.asList(new String[] { "basic_1", "basic_2", "basic_3", "basic_4",
					"basic_5", "basic_6", "basic_7", "basic_8", "basic_9", "basic_10", "basic_12", "basic_13",
					"basic_15", "basic_16", "basic_17" });
			// Extract fields grouped in basicdata
			elements = htmlDocument.getElementsByClass("mod_n_basic");
			// Entries with the same value in headers need to be combined into one entry
			String headersValuePrevious = "";
			String headersValueThis = "";
			for (Element ele : elements) {
				headersValueThis = ele.attr("headers");
				// If this is true: continue in next column
				if (!headersValueThis.equals(headersValuePrevious)) {
					bw.write("\",\"");
					if (((basicFields.indexOf(headersValueThis)) - (basicFields.indexOf(headersValuePrevious))) > 1) {
						// The course is missing one of the fields: need to fill in a blank column entry
						bw.write("\",\"");
					}
				} else {
					bw.write(";");
				}
				bw.write(cleanText(ele.text()));
				headersValuePrevious = headersValueThis;
			}

			// To extract terms, persons
			// Skipping institutions (last element in this collection)
			String persons_1 = "";
			String persons_2 = "";

			String collectFirst = "";
			String collectDays = "";
			String collectTimes = "";
			String collectRhythm = "";
			String collectDuration = "";
			String collectRoom = "";
			String collectRoomPlan = "";
			String collectStatus = "";
			String collectRemarks = "";
			String collectCancelledDates = "";
			String collectMaxParticipants = "";
			String[] variables = new String[] { collectFirst, collectDays, collectTimes, collectRhythm, collectDuration,
					collectRoom, collectRoomPlan, collectStatus, collectRemarks, collectCancelledDates,
					collectMaxParticipants };

			for (String className : new String[] { "mod_n_odd", "mod_n_even" }) {
				elements = htmlDocument.getElementsByClass(className);

				int index = 0;
				for (Element ele : elements) {
					String temp = cleanText(ele.text());
					if (ele.attr("headers").equals("persons_1")) {
						persons_1 = persons_1 + temp + ";";
					} else if (ele.attr("headers").equals("persons_2")) {
						persons_2 = persons_2 + temp + ";";
					} else if (ele.hasClass("regular")) {
						System.err.println("found it!");
					} else {
						variables[index] = variables[index] + temp + ";";
						index++;
						if (index == variables.length) {
							index = 0;
						}
					}
				}
			}

			for (int i = 0; i < variables.length; i++) {
				String str = variables[i];
				bw.write("\",\"" + str);
			}

			bw.write("\",\"" + persons_1);
			bw.write("\",\"" + persons_2);

			// To extract textual remarks
			// Kommentar, Literatur, Bemerkung, Voraussetzungen, Leistungsnachweis
			// Collect whether this course has this field, as some have missing fields
			Boolean[] textFields = new Boolean[] { false, false, false, false, false };
			boolean reachedLabelSection = false;
			Elements titles = htmlDocument.getElementsByClass("mod");
			for (Element t : titles) {
				System.out.println(t.text());
				if (t.text().equals("Zuständigkeit")) {
					reachedLabelSection = true;
				}
				if (reachedLabelSection) {
					if (t.text().equals("Kommentar")) {
						textFields[0] = true;
					}
					if (t.text().equals("Literatur")) {
						textFields[1] = true;
					}
					if (t.text().equals("Bemerkung")) {
						textFields[2] = true;
					}
					if (t.text().equals("Voraussetzungen")) {
						textFields[3] = true;
					}
					if (t.text().equals("Leistungsnachweis")) {
						textFields[4] = true;
					}
				}
			}
			elements = htmlDocument.getElementsByClass("mod_n");

//			for (Element ele : elements) {
//				bw.write("\",\"" + cleanText(ele.text()));
//			}

			int missingFieldsSoFar = 0;

			for (int i = 0; i < 5; i++) {
				System.out.println(textFields[i]);
			}
			System.out.println(elements.size());

			for (int i = 0; i < textFields.length; i++) {
				if (!textFields[i]) {
					bw.write("\",\"");
					missingFieldsSoFar++;
				} else {
//					System.out.println(elements.get(i-missingFieldsSoFar).text());
					bw.write("\",\"" + cleanText(elements.get(i - missingFieldsSoFar).text()));
				}
			}

			bw.write("\",\"" + courseBase.contains(title) + "\"");
			bw.newLine();
		}
	}

	public boolean retrieveDocument(String url) {
		try {
			Connection connection = Jsoup.connect(url).userAgent(USER_AGENT);
			Document htmlDocument = connection.get();
			this.htmlDocument = htmlDocument;

			if (connection.response().statusCode() == 200) // HTTP OK
			{
				System.out.println("\n**Visiting** Received web page at " + url);
			}
			if (!connection.response().contentType().contains("text/html")) {
				System.out.println("**Failure** Retrieved something other than HTML");
				return false;
			}
			return true;
		} catch (IOException ioe) {
			System.out.println("Error in out HTTP request " + ioe);
			return false;
		}
	}

	private String cleanText(String text) {
		text = text.replaceAll(";", " ");
		if (text.matches("^[1-9]*-[1-9]*$")) {
			text = text.replace("-", " - ");
		}
		return text.replaceAll("\"", "\"\"");

	}

	public Set<String> getTitles() {
		return distinctCourses;
	}

	public void resetTitles() {
		courseBase.addAll(distinctCourses);
		distinctCourses.clear();
		wroteColumnHeaders = false;
	}
}