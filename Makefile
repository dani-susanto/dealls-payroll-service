include .env

APP_CONTAINER=dealls-payroll-app
DB_CONTAINER=dealls-payroll-db
APP_CONTAINER_MIGRATION_DIR=/app/src/database/migration

.PHONY: migration migrate migrate-reset migrate-revert migrate-status seed seed-create start stop restart-app reset test test-watch test-cov

migration:
	@if [ -z "$(name)" ]; then \
		echo "❌ Please provide a name using: make migration name=your_migration"; \
		exit 1; \
	fi
	@echo "📦 Creating migration: $(name)..."
	@docker exec -it $(APP_CONTAINER) npm run migration:create --name=$(name)
	@echo "✅ Migration created: $(name)"

migrate:
	@echo "🚀 Running migrations..."
	@docker exec -it $(APP_CONTAINER) npm run migration:run
	@echo "✅ Migrations applied successfully."

migrate-reset:
	@echo "🧨 Resetting all migrations..."
	@docker exec -it $(APP_CONTAINER) npm run migration:reset
	@echo "✅ Reset completed."

migrate-revert:
	@echo "↩️  Rolling back last migration..."
	@docker exec -it $(APP_CONTAINER) npm run migration:revert
	@echo "✅ Rollback completed."

migrate-status:
	@echo "📊 Current migration status:"
	@docker exec -it $(APP_CONTAINER) npm run migration:show

seed:
	@echo "🌱 Running seeders..."
	@docker exec -it $(APP_CONTAINER) npm run seed:run
	@echo "✅ Seeding complete."

start:
	@echo "🚀 Starting the application..."
	@docker compose up -d --build 
	@echo "✅ Application started."

stop:
	@echo "🛑 Stopping the application..."
	@docker compose down
	@echo "✅ Application stopped."

restart-app:
	@echo "🔄 Restarting the application..."
	@docker compose restart $(APP_CONTAINER)
	@docker logs -f $(APP_CONTAINER)
	@echo "✅ Application restarted."

reset: migrate-reset stop
	@echo "🧹 Removing all containers..."
	@docker rm $(APP_CONTAINER) $(DB_CONTAINER) adminer
	@echo "✅ Containers cleaned up"

test:
	@echo "🧪 Running tests..."
	@docker exec -it $(APP_CONTAINER) npm run test
	@echo "✅ Tests completed."

test-watch:
	@echo "👀 Running tests in watch mode..."
	@docker exec -it $(APP_CONTAINER) npm run test:watch

test-cov:
	@echo "📊 Running tests with coverage..."
	@docker exec -it $(APP_CONTAINER) npm run test:cov
	@echo "✅ Coverage report generated."