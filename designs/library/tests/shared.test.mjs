// This file is auto-generated | Any changes you make will be overwritten.
import { Library, about, i18n } from '../src/index.mjs'

// Shared tests
import { testPatternConfig } from '../../../tests/designs/config.mjs'
import { testPatternI18n } from '../../../tests/designs/i18n.mjs'
import { testPatternDrafting } from '../../../tests/designs/drafting.mjs'
import { testPatternSampling } from '../../../tests/designs/sampling.mjs'

// Test config
testPatternConfig(Library, about)

// Test translation
testPatternI18n(Library, i18n)

// Test drafting - Change the second parameter to `true` to log errors
testPatternDrafting(Library, false)

// Test sampling - Change the second parameter to `true` to log errors
testPatternSampling(Library, false)
