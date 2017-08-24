# /!\ you need to install pandoc to run this script

import os
from subprocess import check_output

template_top = """<!doctype html>
<html>
    <head>
        <title>%s</title>
        <meta charset="utf-8">
        <link rel="stylesheet" href="../index.css">
        <link href="https://fonts.googleapis.com/css?family=Josefin+Sans:100,400,700" rel="stylesheet">
    </head>
    <body>
        <div id="page">
            <header>
                <div id="icons">
                    <a class="icon" target="_blank" href="https://docs.google.com/document/d/1o_tesZvLk8ptZLTAp94PbY6uaRWE1ztGSL3LrxOU468/pub"><img src="../images/resume.png"></a>
                    <a class="icon" target="_blank" href="https://github.com/jeremt"><img src="../images/github.png"></a>
                    <a class="icon" target="_blank" href="https://www.instagram.com/jeremietaboada/"><img src="../images/instagram.png"></a>
                    <a class="icon" target="_blank" href="https://www.linkedin.com/profile/view?id=208391836&trk=nav_responsive_tab_profile"><img src="../images/linkedin.png"></a>
                    <a class="icon" target="_blank" href="mailto:taboada.jeremie@gmail.com"><img src="../images/contact.png"></a>
                </div>
                <div id="name"><a href="../index.html">Jeremie Taboada</a></div>
            </header>
"""

template_bottom = """
        </div> <!-- #page -->
    </body>
</html>
"""

for path in os.listdir("pages"):
    if path.endswith(".md"):
        name = path[:-3]
        article_body = check_output([
            'pandoc',
            '--ascii', '--from=markdown', '--to=html',
            'pages/%s.md' % name,
        ])
        with open('pages/%s.html' % name, 'w') as f:
            f.write((template_top % name) + article_body + template_bottom)

