
BUILD = \
	build/index.js

MIN = \
	build/index.min.js

LIB = \
	lib/pages.js \
	lib/nav.js \
	lib/index.js

all: build minify server

build:
	@echo "\033[36mbuild -\033[m lib/*.js -> build/index.js"
	@mkdir -p build
	@cat $(LIB) > $(BUILD)

minify:
	@ command -v uglifyjs > /dev/null && \
	uglifyjs $(BUILD) > $(MIN) && \
	echo "\033[36mminify -\033[m $(MIN)" || \
	echo "\033[31merror -\033[m uglifyjs not installed"

server:
	@echo "\033[36mserver -\033[m started on port 8000"
	@python -m SimpleHTTPServer

.PHONY: build