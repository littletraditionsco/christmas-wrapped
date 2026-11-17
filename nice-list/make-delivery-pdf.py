#!/usr/bin/env python3
"""One-page buyer delivery sheet for Santa's Nice List Reveal.

The private link is the product. Names and deeds are never in the URL.
"""
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
import qrcode

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "santas-nice-list-delivery.pdf")
URL = "https://littletraditionsco.github.io/christmas-wrapped/nice-list/"

EVE = (0x14 / 255, 0x31 / 255, 0x28 / 255)
EVE_DEEP = (0x0E / 255, 0x22 / 255, 0x1C / 255)
CREAM = (0xF4 / 255, 0xEF / 255, 0xE6 / 255)
INK = (0x24 / 255, 0x18 / 255, 0x16 / 255)
MUTED = (0x5C / 255, 0x4A / 255, 0x42 / 255)
CRAN = (0xA3 / 255, 0x18 / 255, 0x2F / 255)
GOLD = (0x6F / 255, 0x54 / 255, 0x24 / 255)
FOIL = (0xD4 / 255, 0xBC / 255, 0x8A / 255)

pdfmetrics.registerFont(TTFont("Serif", "/usr/share/fonts/truetype/noto/NotoSerif-Regular.ttf"))
pdfmetrics.registerFont(TTFont("SerifItalic", "/usr/share/fonts/truetype/noto/NotoSerif-Italic.ttf"))
pdfmetrics.registerFont(TTFont("SerifBold", "/usr/share/fonts/truetype/noto/NotoSerif-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Sans", "/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf"))
pdfmetrics.registerFont(TTFont("SansBold", "/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf"))


def wrap(c, text, font, size, width):
    c.setFont(font, size)
    words = text.split()
    lines, cur = [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if c.stringWidth(trial, font, size) <= width:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def main():
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=12, border=1)
    qr.add_data(URL)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#143128", back_color="#F4EFE6")
    qr_path = "/tmp/nice-list-qr.png"
    img.save(qr_path)

    W, H = letter
    c = canvas.Canvas(OUT, pagesize=letter)
    c.setTitle("Santa's Nice List Reveal — Little Traditions Co.")
    c.setAuthor("Little Traditions Co.")

    c.setFillColor(EVE)
    c.rect(0, H - 118, W, 118, fill=1, stroke=0)
    c.setFillColor(FOIL)
    c.setFont("SansBold", 9)
    c.drawCentredString(W / 2, H - 48, "LITTLE TRADITIONS CO.")
    c.setFillColor(CREAM)
    c.setFont("SerifItalic", 13)
    c.drawCentredString(W / 2, H - 70, "Make the little moments last")
    c.setStrokeColor(FOIL)
    c.setLineWidth(0.6)
    c.line(W / 2 - 36, H - 86, W / 2 + 36, H - 86)

    c.setFillColor(CREAM)
    c.rect(0, 0, W, H - 118, fill=1, stroke=0)

    y = H - 152
    c.setFillColor(EVE)
    c.setFont("Serif", 26)
    c.drawCentredString(W / 2, y, "Santa\u2019s Nice List Reveal")
    y -= 26
    c.setFillColor(INK)
    what = (
        "A private Christmas moment for your phone. You write the real good things "
        "each child did this year. They tap once, the book finds their name, and a "
        "keepsake certificate is theirs to save and send. One purchase covers every child. "
        "Nothing is stored online, and this link does not show any names or deeds."
    )
    for line in wrap(c, what, "Sans", 11, 7.15 * inch):
        c.setFont("Sans", 11)
        c.drawString(0.7 * inch, y, line)
        y -= 15

    y -= 10
    c.setStrokeColor(FOIL)
    c.setLineWidth(1)
    c.line(0.7 * inch, y, W - 0.7 * inch, y)
    y -= 22
    c.setFillColor(GOLD)
    c.setFont("SansBold", 9)
    c.drawCentredString(W / 2, y, "YOUR PRIVATE LINK")

    qr_size = 1.85 * inch
    qr_x = (W - qr_size) / 2
    qr_y = y - qr_size - 14
    c.setStrokeColor(EVE)
    c.setLineWidth(1)
    c.roundRect(qr_x - 8, qr_y - 8, qr_size + 16, qr_size + 16, 6, fill=0, stroke=1)
    c.drawImage(qr_path, qr_x, qr_y, qr_size, qr_size, mask="auto")

    y = qr_y - 26
    c.setFillColor(EVE)
    c.setFont("Sans", 9)
    c.drawCentredString(W / 2, y, URL)
    url_w = c.stringWidth(URL, "Sans", 9)
    c.linkURL(URL, ((W - url_w) / 2, y - 3, (W + url_w) / 2, y + 11))
    y -= 28

    c.setFillColor(GOLD)
    c.setFont("SansBold", 9)
    c.drawString(0.7 * inch, y, "HOW TO DO IT")
    y -= 22
    steps = [
        "Open the link on your phone. Scan the code with the camera, then tap the banner. Or type the address above.",
        "Add each child, a pronoun if you want one, and two or three true good deeds. About two minutes.",
        "Hand them the phone. They tap Check my name. Save or share the certificate when the seal lands.",
    ]
    for i, step in enumerate(steps, 1):
        c.setFillColor(CRAN)
        c.circle(0.92 * inch, y + 4, 10, fill=1, stroke=0)
        c.setFillColor(CREAM)
        c.setFont("SansBold", 11)
        c.drawCentredString(0.92 * inch, y, str(i))
        c.setFillColor(INK)
        lines = wrap(c, step, "Sans", 11, 6.35 * inch)
        for li, line in enumerate(lines):
            c.setFont("Sans", 11)
            c.drawString(1.25 * inch, y - li * 14, line)
        y -= 14 * max(1, len(lines)) + 12

    c.setStrokeColor(FOIL)
    c.setLineWidth(0.8)
    c.line(0.7 * inch, 78, W - 0.7 * inch, 78)
    c.setFillColor(MUTED)
    c.setFont("Sans", 8.5)
    footer = [
        "Works on iPhone and Android, in the browser. No app and no account.",
        "To keep it handy: iPhone, Share, then Add to Home Screen. Android, the browser menu, then Add to Home screen.",
        "Please keep this link in the family. It is made for one household.",
        "Little Traditions Co.  ·  Make the little moments last",
    ]
    fy = 62
    for line in footer:
        c.drawCentredString(W / 2, fy, line)
        fy -= 12

    c.showPage()
    c.save()
    print(OUT)


if __name__ == "__main__":
    main()
