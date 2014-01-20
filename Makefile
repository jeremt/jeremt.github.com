
NAME_WEB 		= index
NAME_GAME		= game

LIBS  			= \
	libraries/jwerty.js \
	libraries/kevent.min.js \
	libraries/marked.js \
	libraries/three.min.js \
	libraries/three/objloader.js

SRCS_WEB 		= \
	scripts/web/quotes.js \
	scripts/web/nav.js \
	scripts/web/pages.js \
	scripts/web/index.js

SRCS_GAME 	= \
	scripts/game/shaders/CopyShader.js \
	scripts/game/shaders/ConvolutionShader.js \
	scripts/game/postprocessing/BloomPass.js \
	scripts/game/postprocessing/EffectComposer.js \
	scripts/game/postprocessing/MaskPass.js \
	scripts/game/postprocessing/RenderPass.js \
	scripts/game/postprocessing/SavePass.js \
	scripts/game/postprocessing/ShaderPass.js \
	scripts/game/postprocessing/TexturePass.js \
	scripts/game/utils/EventEmitter.js \
	scripts/game/particles/Particles.Shader.js \
	scripts/game/particles/Particles.Particle.js \
	scripts/game/particles/Particles.Tween.js \
	scripts/game/particles/Particles.Effect.js \
	scripts/game/particles/Particles.Examples.js \
	scripts/game/EffectManager.js \
	scripts/game/Context.js \
	scripts/game/Gui.js \
	scripts/game/Hud.js \
	scripts/game/Core.js \
	scripts/game/Fireball.js \
	scripts/game/Asteroide.js \
	scripts/game/AsteroideEmitter.js \
	scripts/game/Gridbox.js \
	scripts/game/Spaceship.js \
	scripts/game/game.js

ECHO = echo

all: build

run: build server

build:
	@$(ECHO) Create build/
	@mkdir -p build

	@$(ECHO) Build build/$(NAME_GAME).js
	@cat $(LIBS) > build/$(NAME_GAME).js
	@cat $(SRCS_GAME) >> build/$(NAME_GAME).js

	@$(ECHO) Build build/$(NAME_WEB).js
	@cat $(LIBS) > build/$(NAME_WEB).js
	@cat $(SRCS_WEB) >> build/$(NAME_WEB).js

# TODO - Replace that by online tools.

minify:
	@ command -v uglifyjs > /dev/null && \
	uglifyjs $(BUILD) > $(MIN) && \
	$(ECHO) 'Minify project...' || \
	$(ECHO) 'Error: uglifyjs not installed.'

server:
	@$(ECHO) Start server at localhost:8000
	@python -m SimpleHTTPServer

clean:
	@$(ECHO) Remove build/
	@$(RM) -r build

re:	clean all

.PHONY: build
