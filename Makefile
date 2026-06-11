.PHONY: help
help: ## Ask for help!
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; \
		{printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: install
install: ## Install dependencies
	npm install

.PHONY: dev
dev: ## Run the dev server
	npm run dev

.PHONY: build
build: ## Type-check and build for production
	npm run build

.PHONY: preview
preview: ## Preview the production build locally
	npm run preview

.PHONY: typecheck
typecheck: ## Run the TypeScript type checker
	npm run typecheck

.PHONY: lint
lint: ## Check formatting (Prettier)
	npm run check-format

.PHONY: check-format
check-format: ## Check formatting (Prettier)
	npm run check-format

.PHONY: format
format: ## Format the code (Prettier)
	npm run format

.PHONY: check
check: typecheck check-format ## Run all checks

.PHONY: clean
clean: ## Remove build artifacts
	rm -rf dist node_modules
