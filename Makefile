SHELL := /bin/bash

# Build configuration
# -------------------

APP_NAME = `grep -m1 name package.json | awk -F: '{ print $$2 }' | sed 's/[ ",]//g'`
APP_VERSION = `grep -m1 version package.json | awk -F: '{ print $$2 }' | sed 's/[ ",]//g'`
GIT_REVISION = `git rev-parse HEAD`

# Linter and formatter configuration
# ----------------------------------

PRETTIER_FILES_PATTERN = ember-cli-build.js testem.js '{app,tests,config,scripts}/**/*.{ts,js,graphql,scss}'
STYLES_PATTERN = './app/**/*.scss'
TEMPLATES_PATTERN = './app/**/*.hbs'

# Introspection targets
# ---------------------

.PHONY: help
help: header targets

.PHONY: header
header:
	@echo "\033[34mEnvironment\033[0m"
	@echo "\033[34m---------------------------------------------------------------\033[0m"
	@printf "\033[33m%-23s\033[0m" "APP_NAME"
	@printf "\033[35m%s\033[0m" $(APP_NAME)
	@echo ""
	@printf "\033[33m%-23s\033[0m" "APP_VERSION"
	@printf "\033[35m%s\033[0m" $(APP_VERSION)
	@echo ""
	@printf "\033[33m%-23s\033[0m" "GIT_REVISION"
	@printf "\033[35m%s\033[0m" $(GIT_REVISION)
	@echo "\n"

.PHONY: targets
targets:
	@echo "\033[34mTargets\033[0m"
	@echo "\033[34m---------------------------------------------------------------\033[0m"
	@perl -nle'print $& if m{^[a-zA-Z_-]+:.*?## .*$$}' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-22s\033[0m %s\n", $$1, $$2}'


# Development targets
# -------------------

.PHONY: dependencies
dependencies: ## Install required dependencies
	node ./scripts/enforce-engine-versions.js
	npm ci --legacy-peer-deps

.PHONY: package
package: package-firefox ## Package the Firefox extension

.PHONY: package-firefox
package-firefox: ## Package the firefox extension
	node ./scripts/enforce-engine-versions.js
	npm run package

.PHONY: dev-firefox
dev-firefox: ## Build the extension for Firefox development (then load dist/dev in about:debugging)
	node ./scripts/enforce-engine-versions.js
	npm run dev

.PHONY: dev
dev: ## Build the Firefox extension for development
	node ./scripts/enforce-engine-versions.js
	npm run dev

.PHONY: test
test: ## Run the test suite
	node ./scripts/enforce-engine-versions.js
	npm run test

.PHONY: test-browser
test-browser: ## Run the test suite within a browser
	node ./scripts/enforce-engine-versions.js
	npx ember test --server

# Check, lint and format targets
# ------------------------------

.PHONY: format
format: ## Format project files
	npx prettier --write $(PRETTIER_FILES_PATTERN)
	npx stylelint $(STYLES_PATTERN) --fix --quiet
	npx eslint --ext .js,.ts . --fix --quiet

.PHONY: verify
verify: lint-scripts lint-styles lint-templates check-types ## verify project files

.PHONY: check-format
check-format: ## Verify prettier formatting
	npx prettier --check $(PRETTIER_FILES_PATTERN)

.PHONY: check-types
check-types: ## Verify typescript typings
	# See https://github.com/glimmerjs/glimmer-vm/issues/946 for details about the
	# --skipLibCheck flag
	npx tsc --skipLibCheck

.PHONY: lint-scripts
lint-scripts:
	npx eslint --ext .js,.ts .

.PHONY: lint-styles
lint-styles:
	npx stylelint $(STYLES_PATTERN)

.PHONY: lint-templates
lint-templates:
	npx ember-template-lint $(TEMPLATES_PATTERN)

.PHONY: lint-firefox
lint-firefox:
	npx addons-linter ./dist-packages/better-trading-firefox.xpi
