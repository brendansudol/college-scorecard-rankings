[brendansudol.com/college-scorecard-rankings](http://www.brendansudol.com/college-scorecard-rankings)

A tool to get the top/bottom 50 colleges based on the things important to you

---

to run this locally:

    npm install
    npm run dev

then, in another tab:

    python -m SimpleHTTPServer

---

to recreate the cleaned dataset (requires python & virtualenv):

    cd college-data/
    virtualenv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ipy-notebooks/
    ipython notebook

then open `munge.ipynb` and run :)