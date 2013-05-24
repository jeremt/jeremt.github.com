
BUILD = \
	build/index.js

MIN = \
	build/index.min.js

SRC = \
	deps/jwerty.js \
	deps/marked.js \
	deps/tquery-bundle.js \
	deps/tquery/domevent.js \
	lib/meteor.js \
	lib/game.js \
	lib/pages.js \
	lib/nav.js \
	lib/index.js

ECHO = echo

all: build minify server

build:
	@$(ECHO) 'Build project...'
	@mkdir -p build
	@cat $(SRC) > $(BUILD)

minify:
	@ command -v uglifyjs > /dev/null && \
	uglifyjs $(BUILD) > $(MIN) && \
	$(ECHO) 'Minify project...' || \
	$(ECHO) 'Error: uglifyjs not installed.'

server:
	@$(ECHO) 'Server is starting...'
	@python -m SimpleHTTPServer

clean:
	@$(ECHO) 'Clean project...'
	@$(RM) -r build

re:	clean all

.PHONY: build