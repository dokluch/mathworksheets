/**
 * Registers every locale's catalog. Imported for its side effect by everything
 * that renders more than one language: the Vite config, the build scripts, the
 * edge middleware and the test setup. Browser code must not import it, or all
 * seven catalogs land back in the bundle; it loads one through ./load.js.
 */
import { registerMessages } from './index.js'
import fr from './messages/fr.js'
import es from './messages/es.js'
import de from './messages/de.js'
import it from './messages/it.js'
import ru from './messages/ru.js'
import zh from './messages/zh.js'

for (const [locale, messages] of Object.entries({ fr, es, de, it, ru, zh })) registerMessages(locale, messages)
