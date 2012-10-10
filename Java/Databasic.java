import java.io.*;
import java.util.regex.*;
import org.apache.poi.hwpf.HWPFDocument;
import org.apache.poi.hwpf.usermodel.*;

public class Databasic {

	public static void parse() {
		long start = System.currentTimeMillis();
		File file = null;
		try {
			file = new File("/home/arnav/workspace/Databasic/Packets/Yale A.doc");
			FileInputStream fis=new FileInputStream(file.getAbsolutePath());
			HWPFDocument document=new HWPFDocument(fis);

			Range range = document.getRange();
			boolean isBonus = false;
			
			//Patterns
			Pattern pIsBonus = Pattern.compile("bonuse??s??", Pattern.CASE_INSENSITIVE);
			Pattern pQuestion = Pattern.compile("^\\s??(\\d{1,2})\\.\\s", Pattern.CASE_INSENSITIVE);
			Pattern pAnswer = Pattern.compile("^\\s??ANSWER:(.*)", Pattern.CASE_INSENSITIVE);
			Pattern pBonusPart = Pattern.compile("^\\[10\\]\\s(.*)", Pattern.CASE_INSENSITIVE);
			for(int i=0; i<range.numParagraphs(); i++) {
				Paragraph para = range.getParagraph(i);

				String paraText = para.text().trim();

				if(paraText.isEmpty()) {
					continue;
				}

				Matcher m = pIsBonus.matcher(paraText);
				if(m.find()) {
					System.out.println("*********************** In bonus!");
					isBonus = true;
					continue;
				}

				Matcher m2 = pQuestion.matcher(paraText);
				if(m2.find()) {
					System.out.println(m2.group(1) + ". " + paraText.substring(m2.end()));
					continue;
				}

				Matcher m3 = pAnswer.matcher(paraText);
				StringBuilder sb = new StringBuilder();
				if(m3.find()) {
					//System.out.println("Answer: " + paraText.substring(m3.end()));
					for(int k=0; k<para.numCharacterRuns(); k++) {
						CharacterRun run = para.getCharacterRun(k);
						boolean isBold = run.isBold();
						boolean isItalic = run.isItalic();
						boolean isUnderline = run.getUnderlineCode() != 0;
						boolean isSpecial = isBold||isItalic||isUnderline;
						String runText = run.text();
						if(runText.trim().isEmpty()) {
							continue;
						}

						if(isBold) {
							sb.append("<b>");
						}
						if(isItalic) {
							sb.append("<i>");
						}
						if(isUnderline) {
							sb.append("<u>");
						}

						m3 = pAnswer.matcher(runText);
						String temp = m3.find() ? m3.group(1) : runText;
						if(isSpecial) {
							temp = temp.replaceAll("[\n\r]", "");
						}
						sb.append(temp);
						if(isUnderline) {
							sb.append("</u>");
						}
						if(isItalic) {
							sb.append("</i>");
						}
						if(isBold) {
							sb.append("</b>");
						}

					}
					System.out.println(sb.toString().trim());
					continue;
				}

				Matcher m4 = pBonusPart.matcher(paraText);
				if(m4.find()){
					System.out.println(m4.group(1));
					continue;
				}
				System.err.println("Unhandled text: " + paraText);
			}

		}
		catch(Exception exep){
			System.err.println("OH MY GOD THESE FRENCH FRIES ARE THICK!");
			System.exit(1);
		}
		System.out.println("Run time: " + (System.currentTimeMillis() - start) + "");
	}
	public static void main(String[] args){
		parse();
	}
}