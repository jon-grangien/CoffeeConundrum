import * as Phaser from 'phaser-ce'

/**
 * Sets to skip Phaser internal type checking
 * Workaround until https://github.com/photonstorm/phaser-ce/issues/317 is resolved
 */
export const skipBuiltinTypeChecks = (): void => {
    Phaser['Component'].Core.skipTypeChecks = true
}

