## data/config.json layout:

```json
{
  // global bot settings (apply to both bot instances)
	"global": {
		"search": {
			"apiKey": "...",
			"engineId": "..."
		},
		"database": {
			"host": "...",
			"user": "...",
			"password": "...",
			"dbname": "..."
		}
	},
  // public bot instance (exposed to users)
	"public": {
		"botToken": "...",
		"appId": "..."
	},
  // private bot instance (for testing and development)
	"private": {
		"botToken": "...",
		"guildId": "...",
		"appId": "..."
	}
}
```