/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const utils = require("../utils")

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Creates AST event handlers for no-invalid-v-else-if.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {object} AST event handlers.
 */
function create(context) {
    utils.registerTemplateBodyVisitor(context, {
        "VAttribute[directive=true][key.name='else-if']"(node) {
            if (!utils.prevElementHasIf(node.parent.parent)) {
                context.report({
                    node,
                    loc: node.loc,
                    message: "'v-else-if' directives require being preceded by the element which has a 'v-if' or 'v-else-if' directive.",
                })
            }
            if (utils.hasDirective(node.parent, "if")) {
                context.report({
                    node,
                    loc: node.loc,
                    message: "'v-else-if' and 'v-if' directives can't exist on the same element.",
                })
            }
            if (utils.hasDirective(node.parent, "else")) {
                context.report({
                    node,
                    loc: node.loc,
                    message: "'v-else-if' and 'v-else' directives can't exist on the same element.",
                })
            }
            if (node.key.argument) {
                context.report({
                    node,
                    loc: node.loc,
                    message: "'v-else-if' directives require no argument.",
                })
            }
            if (node.key.modifiers.length > 0) {
                context.report({
                    node,
                    loc: node.loc,
                    message: "'v-else-if' directives require no modifier.",
                })
            }
            if (!utils.hasAttributeValue(node)) {
                context.report({
                    node,
                    loc: node.loc,
                    message: "'v-else-if' directives require that attribute value.",
                })
            }
        },
    })

    return {}
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    create,
    meta: {
        docs: {
            description: "disallow invalid v-else-if directives.",
            category: "Possible Errors",
            recommended: true,
        },
        fixable: false,
        schema: [],
    },
}
