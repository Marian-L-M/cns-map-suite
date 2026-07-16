/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/admin/app/ContextPanel.tsx"
/*!****************************************!*\
  !*** ./src/admin/app/ContextPanel.tsx ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ContextPanel)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _forms_ObjectForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./forms/ObjectForm */ "./src/admin/app/forms/ObjectForm.tsx");
/* harmony import */ var _forms_LabelForm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./forms/LabelForm */ "./src/admin/app/forms/LabelForm.tsx");
/* harmony import */ var _forms_AreaForm__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./forms/AreaForm */ "./src/admin/app/forms/AreaForm.tsx");
/* harmony import */ var _forms_HierarchyRegionForm__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./forms/HierarchyRegionForm */ "./src/admin/app/forms/HierarchyRegionForm.tsx");
/* harmony import */ var _forms_NodeList__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./forms/NodeList */ "./src/admin/app/forms/NodeList.tsx");
/* harmony import */ var _forms_RegionNodeList__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./forms/RegionNodeList */ "./src/admin/app/forms/RegionNodeList.tsx");
/* harmony import */ var _shared_SaveStatus__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./shared/SaveStatus */ "./src/admin/app/shared/SaveStatus.tsx");
/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../icons */ "./src/admin/icons.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__);










function ContextPanel({
  activeTab,
  selectedObject,
  selectedArea,
  selectedLabel,
  selectedRegion,
  onObjectSave,
  onObjectDelete,
  onObjectClose,
  onObjectReposition,
  onObjectDuplicate,
  onLabelSave,
  onLabelDelete,
  onLabelClose,
  onLabelReposition,
  onLabelDuplicate,
  onLabelLocalUpdate,
  onAreaSave,
  onAreaDelete,
  onAreaClose,
  onAreaDuplicate,
  onAreaNodesUpdate,
  onAreaShapeTypeChange,
  onRegionSave,
  onRegionDelete,
  onRegionClose,
  onRegionNodesUpdate
}) {
  const [objFormData, setObjFormData] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [areaFormData, setAreaFormData] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [labelFormData, setLabelFormData] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [regionFormData, setRegionFormData] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [icons, setIcons] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(_icons__WEBPACK_IMPORTED_MODULE_8__.iconLibraryCache || []);
  const [status, setStatus] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({
    text: '',
    type: ''
  });
  const [saving, setSaving] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (selectedObject) {
      setObjFormData((0,_forms_ObjectForm__WEBPACK_IMPORTED_MODULE_1__.defaultObjectFormData)(selectedObject, null, null));
      setStatus({
        text: '',
        type: ''
      });
      if (!_icons__WEBPACK_IMPORTED_MODULE_8__.iconLibraryCache) {
        (0,_icons__WEBPACK_IMPORTED_MODULE_8__.loadIconLibraryIntoCache)().then(() => setIcons(_icons__WEBPACK_IMPORTED_MODULE_8__.iconLibraryCache || []));
      }
    }
  }, [selectedObject?.id]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (selectedArea) {
      setAreaFormData((0,_forms_AreaForm__WEBPACK_IMPORTED_MODULE_3__.defaultAreaFormData)(selectedArea));
      setStatus({
        text: '',
        type: ''
      });
    }
  }, [selectedArea?.id]);

  // Geometry deps: canvas drags update x/y/offsets on the list — the form
  // must pick those up. Form-driven live edits round-trip to the same
  // values, so the reset is a no-op for them.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (selectedLabel) {
      setLabelFormData((0,_forms_LabelForm__WEBPACK_IMPORTED_MODULE_2__.defaultLabelFormData)(selectedLabel, null, null));
    }
  }, [selectedLabel?.id, selectedLabel?.x, selectedLabel?.y, selectedLabel?.offset_x, selectedLabel?.offset_y]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (selectedLabel) {
      setStatus({
        text: '',
        type: ''
      });
    }
  }, [selectedLabel?.id]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (selectedRegion) {
      setRegionFormData((0,_forms_HierarchyRegionForm__WEBPACK_IMPORTED_MODULE_4__.defaultHierarchyFormData)(selectedRegion));
      setStatus({
        text: '',
        type: ''
      });
    }
  }, [selectedRegion?.id]);
  const hasSelection = !!selectedObject || !!selectedArea || !!selectedLabel || !!selectedRegion;
  if (!hasSelection) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("aside", {
      className: "cns-editor-context",
      "aria-label": "Context panel",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
        className: "cns-editor-context__empty",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("p", {
          children: activeTab === 'areas' ? 'Select an area on the canvas to edit it here.' : activeTab === 'labels' ? 'Select a label on the canvas to edit it here.' : activeTab === 'hierarchy' ? 'Select a region on the canvas to edit it here.' : 'Select an object on the canvas to edit it here.'
        })
      })
    });
  }
  const isObject = !!selectedObject;
  const isLabel = !isObject && !!selectedLabel;
  const isRegion = !isObject && !isLabel && !!selectedRegion;
  const title = isObject ? selectedObject.title || '(no title)' : isLabel ? selectedLabel.text || '(empty label)' : isRegion ? selectedRegion.child_map_title || 'New Region' : selectedArea.title || '(no title)';
  async function handleSave() {
    setSaving(true);
    setStatus({
      text: 'Saving…',
      type: ''
    });
    try {
      if (isObject && objFormData) {
        const data = await onObjectSave((0,_forms_ObjectForm__WEBPACK_IMPORTED_MODULE_1__.collectObjectPayload)(objFormData));
        if (data?.title) setObjFormData(prev => prev ? {
          ...prev,
          title: data.title
        } : prev);
      } else if (isLabel && labelFormData) {
        const data = await onLabelSave((0,_forms_LabelForm__WEBPACK_IMPORTED_MODULE_2__.collectLabelPayload)(labelFormData));
        if (data) setLabelFormData((0,_forms_LabelForm__WEBPACK_IMPORTED_MODULE_2__.defaultLabelFormData)(data, null, null));
      } else if (isRegion && regionFormData) {
        const data = await onRegionSave(regionFormData);
        if (data) setRegionFormData((0,_forms_HierarchyRegionForm__WEBPACK_IMPORTED_MODULE_4__.defaultHierarchyFormData)(data));
      } else if (areaFormData) {
        await onAreaSave(areaFormData);
      }
      setStatus({
        text: 'Saved.',
        type: 'ok'
      });
      setTimeout(() => setStatus({
        text: '',
        type: ''
      }), 2000);
    } catch (err) {
      setStatus({
        text: err.message,
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  }
  async function handleDelete() {
    if (isObject) {
      if (!confirm('Delete this object?')) return;
      await onObjectDelete();
    } else if (isLabel) {
      if (!confirm('Delete this label?')) return;
      await onLabelDelete();
    } else if (isRegion) {
      if (!confirm('Delete this hierarchy region?')) return;
      await onRegionDelete();
    } else {
      if (!confirm('Delete this area?')) return;
      await onAreaDelete();
    }
  }
  function handleClose() {
    if (isObject) onObjectClose();else if (isLabel) onLabelClose();else if (isRegion) onRegionClose();else onAreaClose();
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("aside", {
    className: "cns-editor-context",
    "aria-label": "Context panel",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
      id: "cns-context-form",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
        className: "cns-editor-context__header",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
          className: "cns-editor-context__title",
          children: title
        }), isObject && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("button", {
            type: "button",
            className: "button button-small",
            onClick: onObjectReposition,
            children: "Reposition"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("button", {
            type: "button",
            className: "button button-small",
            onClick: onObjectDuplicate,
            children: "Duplicate"
          })]
        }), !isObject && !isLabel && !isRegion && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("button", {
          type: "button",
          className: "button button-small",
          onClick: onAreaDuplicate,
          children: "Duplicate"
        }), isLabel && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("button", {
            type: "button",
            className: "button button-small",
            onClick: onLabelReposition,
            children: "Reposition"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("button", {
            type: "button",
            className: "button button-small",
            onClick: onLabelDuplicate,
            children: "Duplicate"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("button", {
          type: "button",
          className: "cns-editor-context__close",
          "aria-label": "Close",
          onClick: handleClose,
          children: "\xD7"
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
        className: "cns-editor-context__body",
        children: [isObject && objFormData && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_forms_ObjectForm__WEBPACK_IMPORTED_MODULE_1__["default"], {
          formData: objFormData,
          onChange: setObjFormData,
          icons: icons
        }), isLabel && labelFormData && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_forms_LabelForm__WEBPACK_IMPORTED_MODULE_2__["default"], {
          formData: labelFormData,
          onChange: fd => {
            setLabelFormData(fd);
            // Live preview: mirror every form change onto
            // the in-memory label so the canvas updates
            // immediately (Save persists it).
            if (selectedLabel) {
              onLabelLocalUpdate(selectedLabel.id, {
                text: fd.text,
                placement: fd.placement,
                x: fd.x,
                y: fd.y,
                offset_x: fd.offset_x,
                offset_y: fd.offset_y,
                infobox_source: fd.infobox_source,
                linked_post_id: fd.linked_post_id,
                infobox_data: {
                  title: fd.infobox_title,
                  description: fd.infobox_description,
                  image_id: fd.infobox_image_id
                },
                canvas_styles: {
                  bgColor: fd.style_bg,
                  borderColor: fd.style_border,
                  textColor: fd.style_text_color,
                  fontSize: fd.style_font_size
                }
              });
            }
          }
        }), !isObject && !isLabel && !isRegion && areaFormData && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_forms_AreaForm__WEBPACK_IMPORTED_MODULE_3__["default"], {
            formData: areaFormData,
            onChange: setAreaFormData,
            onShapeTypeChange: st => {
              if (selectedArea) onAreaShapeTypeChange?.(selectedArea.id, st);
              setAreaFormData(prev => prev ? {
                ...prev,
                shape_type: st
              } : prev);
            }
          }), selectedArea && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_forms_NodeList__WEBPACK_IMPORTED_MODULE_5__["default"], {
            area: selectedArea,
            onNodesChange: nodes => onAreaNodesUpdate?.(selectedArea.id, nodes)
          })]
        }), isRegion && regionFormData && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_forms_HierarchyRegionForm__WEBPACK_IMPORTED_MODULE_4__["default"], {
            formData: regionFormData,
            onChange: setRegionFormData
          }), selectedRegion && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_forms_RegionNodeList__WEBPACK_IMPORTED_MODULE_6__["default"], {
            region: selectedRegion,
            onNodesChange: nodes => onRegionNodesUpdate(selectedRegion.id, nodes)
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
        className: "cns-editor-context__footer",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_shared_SaveStatus__WEBPACK_IMPORTED_MODULE_7__["default"], {
          text: status.text,
          type: status.type
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("button", {
          type: "button",
          className: "button button-small button-primary",
          disabled: saving,
          onClick: handleSave,
          children: "Save"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("button", {
          type: "button",
          className: "button button-small",
          onClick: handleDelete,
          children: "Delete"
        })]
      })]
    })
  });
}

/***/ },

/***/ "./src/admin/app/EditorHeader.tsx"
/*!****************************************!*\
  !*** ./src/admin/app/EditorHeader.tsx ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EditorHeader)
/* harmony export */ });
/* harmony import */ var _shared_SaveStatus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shared/SaveStatus */ "./src/admin/app/shared/SaveStatus.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


const STATUS_LABELS = {
  draft: 'Draft',
  publish: 'Published',
  private: 'Private'
};
function EditorHeader({
  pageTitle,
  overviewUrl,
  viewUrl,
  status,
  onStatusChange,
  saveStatus,
  onSave
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: "cns-map-editor__header",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("a", {
      href: overviewUrl,
      className: "cns-back-link",
      children: "\u2190 All Maps"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h1", {
      children: pageTitle
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
      className: "cns-map-editor__header-actions",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_shared_SaveStatus__WEBPACK_IMPORTED_MODULE_0__["default"], {
        text: saveStatus.text,
        type: saveStatus.type
      }), viewUrl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("a", {
        href: viewUrl,
        className: "button",
        target: "_blank",
        rel: "noopener noreferrer",
        children: "View Map"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("select", {
        className: "cns-status-select",
        value: status,
        onChange: e => onStatusChange(e.target.value),
        "aria-label": "Post status",
        children: Object.keys(STATUS_LABELS).map(s => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("option", {
          value: s,
          children: STATUS_LABELS[s]
        }, s))
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
        className: "button button-primary",
        onClick: onSave,
        children: "Save Map"
      })]
    })]
  });
}

/***/ },

/***/ "./src/admin/app/IconLibraryApp.tsx"
/*!******************************************!*\
  !*** ./src/admin/app/IconLibraryApp.tsx ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ IconLibraryApp)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/admin/utils.ts");
/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../icons */ "./src/admin/icons.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




function IconLibraryApp() {
  const [icons, setIcons] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    (0,_icons__WEBPACK_IMPORTED_MODULE_2__.loadIconLibraryIntoCache)().then(() => setIcons(_icons__WEBPACK_IMPORTED_MODULE_2__.iconLibraryCache || []));
  }, []);
  function handleAdd() {
    const frame = window.wp.media({
      title: 'Select or Upload SVG Icon',
      button: {
        text: 'Add to library'
      },
      multiple: false,
      library: {
        type: 'image/svg+xml'
      }
    });
    frame.on('select', async () => {
      const att = frame.state().get('selection').first().toJSON();
      setError('');
      try {
        const res = await (0,_utils__WEBPACK_IMPORTED_MODULE_1__.apiFetch)('POST', '/icons', {
          attachment_id: att.id
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to add icon.');
        setIcons(prev => [...prev, data]);
      } catch (err) {
        setError(err.message);
      }
    });
    frame.open();
  }
  async function handleRemove(id) {
    if (!confirm('Remove this icon from the library? (The attachment itself is kept.)')) return;
    setError('');
    try {
      const res = await (0,_utils__WEBPACK_IMPORTED_MODULE_1__.apiFetch)('DELETE', `/icons/${id}`);
      if (!res.ok) throw new Error('Remove failed.');
      setIcons(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    children: [error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "notice notice-error is-dismissible",
      style: {
        margin: '0 0 12px'
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
        children: error
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
        type: "button",
        className: "notice-dismiss",
        onClick: () => setError(''),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
          className: "screen-reader-text",
          children: "Dismiss"
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "cns-icon-library-toolbar",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
        type: "button",
        id: "cns-add-icon-btn",
        className: "button button-primary",
        onClick: handleAdd,
        children: "Add Icon"
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      id: "cns-icon-library-grid",
      className: "cns-icon-library-grid",
      children: icons.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
        className: "cns-icon-library-grid__empty",
        children: "No icons yet. Click \u201CAdd Icon\u201D to upload an SVG."
      }) : icons.map(icon => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "cns-icon-library-item",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "cns-icon-library-item__preview",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("img", {
            src: icon.url,
            alt: icon.title
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
          className: "cns-icon-library-item__name",
          children: icon.title
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
          type: "button",
          className: "cns-icon-library-item__remove",
          "aria-label": "Remove",
          onClick: () => handleRemove(icon.id),
          children: "\xD7"
        })]
      }, icon.id))
    })]
  });
}

/***/ },

/***/ "./src/admin/app/MapEditorApp.tsx"
/*!****************************************!*\
  !*** ./src/admin/app/MapEditorApp.tsx ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MapEditorApp)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _EditorHeader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EditorHeader */ "./src/admin/app/EditorHeader.tsx");
/* harmony import */ var _TabBar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TabBar */ "./src/admin/app/TabBar.tsx");
/* harmony import */ var _ContextPanel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ContextPanel */ "./src/admin/app/ContextPanel.tsx");
/* harmony import */ var _panels_SettingsPanel__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./panels/SettingsPanel */ "./src/admin/app/panels/SettingsPanel.tsx");
/* harmony import */ var _panels_DescriptionPanel__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./panels/DescriptionPanel */ "./src/admin/app/panels/DescriptionPanel.tsx");
/* harmony import */ var _panels_ObjectsPanel__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./panels/ObjectsPanel */ "./src/admin/app/panels/ObjectsPanel.tsx");
/* harmony import */ var _panels_AreasPanel__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./panels/AreasPanel */ "./src/admin/app/panels/AreasPanel.tsx");
/* harmony import */ var _panels_LabelsPanel__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./panels/LabelsPanel */ "./src/admin/app/panels/LabelsPanel.tsx");
/* harmony import */ var _panels_HierarchyPanel__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./panels/HierarchyPanel */ "./src/admin/app/panels/HierarchyPanel.tsx");
/* harmony import */ var _panels_PreviewPanel__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./panels/PreviewPanel */ "./src/admin/app/panels/PreviewPanel.tsx");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../utils */ "./src/admin/utils.ts");
/* harmony import */ var _areas__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../areas */ "./src/admin/areas.ts");
/* harmony import */ var _forms_LabelForm__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./forms/LabelForm */ "./src/admin/app/forms/LabelForm.tsx");
/* harmony import */ var _forms_ObjectForm__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./forms/ObjectForm */ "./src/admin/app/forms/ObjectForm.tsx");
/* harmony import */ var _forms_AreaForm__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./forms/AreaForm */ "./src/admin/app/forms/AreaForm.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__);

















function buildInitialSettings() {
  const d = window.cnsMapEditor || {};
  return {
    status: d.status ?? 'draft',
    title: d.title ?? '',
    description: d.description ?? '',
    width: d.width ?? 1000,
    aspectRatio: d.aspectRatio ?? 1.0,
    time: d.time ?? 0,
    imageId: d.imageId ?? 0,
    imageUrl: d.imageUrl ?? '',
    imageX: d.imageX ?? 0,
    imageY: d.imageY ?? 0,
    imageW: d.imageWidth ?? 1.0,
    isMaster: d.isMaster ?? false,
    featured: d.featured ?? false,
    bgType: d.bgType ?? 'color',
    bgColor: d.bgColor ?? '#1a1a2e',
    bgImageId: d.bgImageId ?? 0,
    bgImageUrl: d.bgImageUrl ?? '',
    thumbnailId: d.thumbnailId ? d.thumbnailId : null,
    thumbnailUrl: d.thumbnailUrl ?? ''
  };
}
function MapEditorApp() {
  const d = window.cnsMapEditor || {};
  const mapId = d.mapId || 0;
  const isNew = d.isNew || false;
  const overviewUrl = d.overviewUrl || '#';
  const initialParentMaps = d.parentMaps || [];
  const [settings, setSettings] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(buildInitialSettings);
  const [viewUrl, setViewUrl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(d.viewUrl || '');
  const [activeTab, setActiveTab] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('settings');
  const [objectsList, setObjectsList] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [areasList, setAreasList] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [selectedObjectId, setSelectedObjectId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [selectedAreaId, setSelectedAreaId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [labelsList, setLabelsList] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [selectedLabelId, setSelectedLabelId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [repositioningLabelId, setRepositioningLabelId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [selectedRegionId, setSelectedRegionId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [regionsList, setRegionsList] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [repositioningObjId, setRepositioningObjId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [saveStatus, setSaveStatus] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({
    text: '',
    type: ''
  });
  const selectedObject = objectsList.find(o => o.id === selectedObjectId) || null;
  const selectedArea = areasList.find(a => a.id === selectedAreaId) || null;
  const selectedLabel = labelsList.find(l => l.id === selectedLabelId) || null;
  const selectedRegion = regionsList.find(r => r.id === selectedRegionId) || null;

  // Warn before leaving with unsaved map settings, or while a debounced
  // area-geometry save is still pending. Everything else persists through
  // its own endpoint as you edit.
  const savedSettingsRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(JSON.stringify(buildInitialSettings()));
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    function handleBeforeUnload(e) {
      if (JSON.stringify(settings) !== savedSettingsRef.current || areaGeomSave.current.timer !== null) {
        e.preventDefault();
        e.returnValue = '';
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [settings]);

  // ── Tab switching ─────────────────────────────────────────────────────────

  function handleTabChange(tab) {
    if (tab !== 'objects') {
      setSelectedObjectId(null);
      setRepositioningObjId(null);
    }
    if (tab !== 'labels') {
      setSelectedLabelId(null);
      setRepositioningLabelId(null);
    }
    if (tab !== 'areas') setSelectedAreaId(null);
    if (tab !== 'hierarchy') setSelectedRegionId(null);
    setActiveTab(tab);
  }

  // ── Map settings save ─────────────────────────────────────────────────────

  async function handleSave() {
    setSaveStatus({
      text: 'Saving…',
      type: ''
    });
    const payload = {
      map_id: mapId,
      title: settings.title,
      description: settings.description,
      status: settings.status,
      width: settings.width,
      aspect_ratio: settings.aspectRatio,
      time: settings.time,
      image_id: settings.imageId,
      image_x: settings.imageX,
      image_y: settings.imageY,
      image_width: settings.imageW,
      is_master: settings.isMaster,
      featured: settings.featured,
      bg_type: settings.bgType,
      bg_color: settings.bgColor,
      bg_image_id: settings.bgImageId,
      thumbnail_id: settings.thumbnailId ?? 0
    };
    try {
      const res = await (0,_utils__WEBPACK_IMPORTED_MODULE_11__.apiFetch)('POST', '/maps', payload);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Save failed.');
      savedSettingsRef.current = JSON.stringify(settings);
      if (data.created && data.edit_url) {
        window.location.href = data.edit_url;
      } else {
        if (data.view_url !== undefined) {
          setViewUrl(data.view_url);
        }
        setSaveStatus({
          text: 'Saved.',
          type: 'ok'
        });
        setTimeout(() => setSaveStatus({
          text: '',
          type: ''
        }), 2000);
      }
    } catch (err) {
      setSaveStatus({
        text: err.message,
        type: 'error'
      });
    }
  }

  // ── Object operations ─────────────────────────────────────────────────────

  async function handleObjectSave(formPayload) {
    if (!selectedObjectId) return;
    const res = await (0,_utils__WEBPACK_IMPORTED_MODULE_11__.apiFetch)('POST', `/objects/${selectedObjectId}`, formPayload);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Save failed.');
    setObjectsList(prev => prev.map(o => o.id === selectedObjectId ? data : o));
    return data;
  }
  async function handleObjectPositionUpdate(id, x, y) {
    const res = await (0,_utils__WEBPACK_IMPORTED_MODULE_11__.apiFetch)('PATCH', `/objects/${id}/position`, {
      x,
      y
    });
    const data = await res.json();
    if (res.ok) {
      setObjectsList(prev => prev.map(o => o.id === id ? data : o));
    }
  }

  // Live/local updates: keyboard nudges patch the in-memory object so the
  // canvas moves immediately; the position PATCH persists shortly after.
  function handleObjectLocalUpdate(id, patch) {
    setObjectsList(prev => prev.map(o => o.id === id ? {
      ...o,
      ...patch
    } : o));
  }
  async function handleObjectDuplicate(id) {
    const obj = objectsList.find(o => o.id === id);
    if (!obj) return;
    const payload = (0,_forms_ObjectForm__WEBPACK_IMPORTED_MODULE_14__.collectObjectPayload)((0,_forms_ObjectForm__WEBPACK_IMPORTED_MODULE_14__.defaultObjectFormData)(obj, null, null));
    payload.x += 24;
    payload.y += 24;
    const created = await handleObjectAdd(payload);
    setSelectedObjectId(created.id);
  }

  // ── Label operations ──────────────────────────────────────────────────────

  async function handleLabelAdd(payload) {
    const res = await (0,_utils__WEBPACK_IMPORTED_MODULE_11__.apiFetch)('POST', `/maps/${mapId}/labels`, payload);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed.');
    setLabelsList(prev => [...prev, data]);
    return data;
  }
  async function handleLabelSave(payload) {
    if (!selectedLabelId) return;
    const res = await (0,_utils__WEBPACK_IMPORTED_MODULE_11__.apiFetch)('POST', `/labels/${selectedLabelId}`, payload);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Save failed.');
    setLabelsList(prev => prev.map(l => l.id === selectedLabelId ? data : l));
    return data;
  }
  async function handleLabelGeometryUpdate(id, geometry) {
    const res = await (0,_utils__WEBPACK_IMPORTED_MODULE_11__.apiFetch)('PATCH', `/labels/${id}/position`, geometry);
    const data = await res.json();
    if (res.ok) {
      setLabelsList(prev => prev.map(l => l.id === id ? data : l));
    }
  }

  // Live preview: form edits update the in-memory label immediately so the
  // canvas reflects colors/text/placement before saving.
  function handleLabelLocalUpdate(id, patch) {
    setLabelsList(prev => prev.map(l => l.id === id ? {
      ...l,
      ...patch
    } : l));
  }
  async function handleLabelDuplicate(id) {
    const label = labelsList.find(l => l.id === id);
    if (!label) return;
    const payload = (0,_forms_LabelForm__WEBPACK_IMPORTED_MODULE_13__.collectLabelPayload)((0,_forms_LabelForm__WEBPACK_IMPORTED_MODULE_13__.defaultLabelFormData)(label, null, null));
    payload.x += 24;
    payload.y += 24;
    const created = await handleLabelAdd(payload);
    setSelectedLabelId(created.id);
  }
  async function handleLabelDeleteById(id) {
    const res = await (0,_utils__WEBPACK_IMPORTED_MODULE_11__.apiFetch)('DELETE', `/labels/${id}`);
    if (!res.ok) throw new Error('Delete failed.');
    setLabelsList(prev => prev.filter(l => l.id !== id));
    if (selectedLabelId === id) setSelectedLabelId(null);
  }

  // ── Area operations ───────────────────────────────────────────────────────

  // Canvas node edits, node-list edits, and shape-type switches update local
  // state for instant feedback and are persisted shortly after via the
  // geometry PATCH — matching how object/label moves save immediately. The
  // debounce absorbs per-keystroke node-list edits; reading the area from a
  // ref at flush time sends the latest geometry.
  const areasRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(areasList);
  areasRef.current = areasList;
  const areaGeomSave = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    timer: null,
    areaId: null
  });
  async function commitAreaGeometry(areaId) {
    const area = areasRef.current.find(a => a.id === areaId);
    if (!area) return;
    await (0,_utils__WEBPACK_IMPORTED_MODULE_11__.apiFetch)('PATCH', `/areas/${areaId}/nodes`, {
      nodes: JSON.stringify(area.nodes || []),
      shape_type: area.shape_type || 'POLYGON'
    });
  }
  function scheduleAreaGeometrySave(areaId) {
    const pending = areaGeomSave.current;
    if (pending.timer) {
      window.clearTimeout(pending.timer);
      // Switching areas mid-debounce: flush the previous one first.
      if (pending.areaId !== null && pending.areaId !== areaId) {
        void commitAreaGeometry(pending.areaId);
      }
    }
    pending.areaId = areaId;
    pending.timer = window.setTimeout(() => {
      pending.timer = null;
      pending.areaId = null;
      void commitAreaGeometry(areaId);
    }, 600);
  }
  async function handleAreaSave(formData) {
    if (!selectedAreaId) return;
    const area = areasList.find(a => a.id === selectedAreaId);
    if (!area) return;
    const payload = {
      ...formData,
      nodes: JSON.stringify(area.nodes)
    };
    const res = await (0,_utils__WEBPACK_IMPORTED_MODULE_11__.apiFetch)('POST', `/areas/${selectedAreaId}`, payload);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Save failed.');
    setAreasList(prev => prev.map(a => a.id === selectedAreaId ? data : a));
    return data;
  }
  function handleAreaNodesUpdate(areaId, nodes) {
    setAreasList(prev => prev.map(a => a.id === areaId ? {
      ...a,
      nodes
    } : a));
    scheduleAreaGeometrySave(areaId);
  }
  function handleAreaShapeTypeChange(areaId, shapeType) {
    setAreasList(prev => prev.map(a => {
      if (a.id !== areaId) return a;
      return {
        ...a,
        shape_type: shapeType,
        nodes: (0,_areas__WEBPACK_IMPORTED_MODULE_12__.normalizeNodesForShapeType)(a.nodes || [], shapeType)
      };
    }));
    scheduleAreaGeometrySave(areaId);
  }

  // ── Object add / delete ───────────────────────────────────────────────────

  async function handleObjectAdd(payload) {
    const res = await (0,_utils__WEBPACK_IMPORTED_MODULE_11__.apiFetch)('POST', `/maps/${mapId}/objects`, payload);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed.');
    setObjectsList(prev => [...prev, data]);
    return data;
  }
  async function handleObjectDeleteById(id) {
    const res = await (0,_utils__WEBPACK_IMPORTED_MODULE_11__.apiFetch)('DELETE', `/objects/${id}`);
    if (!res.ok) throw new Error('Delete failed.');
    setObjectsList(prev => prev.filter(o => o.id !== id));
    if (selectedObjectId === id) setSelectedObjectId(null);
  }
  async function handleAreaDuplicate(id) {
    const area = areasList.find(a => a.id === id);
    if (!area) return;
    const W = settings.width || 1000;
    const H = W / (settings.aspectRatio || 1);
    // Nodes are normalized 0–1; offset the copy by 24 px worth.
    const nodes = (area.nodes || []).map(n => ({
      ...n,
      x: n.x + 24 / W,
      y: n.y + 24 / H
    }));
    const payload = {
      ...(0,_forms_AreaForm__WEBPACK_IMPORTED_MODULE_15__.defaultAreaFormData)(area),
      nodes: JSON.stringify(nodes)
    };
    const res = await (0,_utils__WEBPACK_IMPORTED_MODULE_11__.apiFetch)('POST', `/maps/${mapId}/areas`, payload);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed.');
    }
    setAreasList(prev => [...prev, data]);
    setSelectedAreaId(data.id);
  }
  async function handleAreaDeleteById(id) {
    const res = await (0,_utils__WEBPACK_IMPORTED_MODULE_11__.apiFetch)('DELETE', `/areas/${id}`);
    if (!res.ok) throw new Error('Delete failed.');
    setAreasList(prev => prev.filter(a => a.id !== id));
    if (selectedAreaId === id) setSelectedAreaId(null);
  }

  // ── Hierarchy region operations ───────────────────────────────────────────

  function handleRegionNodesUpdate(regionId, nodes) {
    setRegionsList(prev => prev.map(r => r.id === regionId ? {
      ...r,
      nodes
    } : r));
  }
  async function handleRegionSave(formData) {
    if (!selectedRegionId || !formData.child_map_id) {
      throw new Error('Select a child map before saving.');
    }
    const region = regionsList.find(r => r.id === selectedRegionId);
    if (!region) return;
    const payload = {
      child_map_id: formData.child_map_id,
      nodes: JSON.stringify(region.nodes),
      style_fill: formData.style_fill,
      style_fill_opacity: formData.style_fill_opacity,
      style_stroke: formData.style_stroke,
      style_stroke_width: formData.style_stroke_width,
      title_override: formData.title_override,
      description_override: formData.description_override
    };
    let res;
    if (selectedRegionId === -1) {
      // Unsaved draft — create.
      res = await (0,_utils__WEBPACK_IMPORTED_MODULE_11__.apiFetch)('POST', `/maps/${mapId}/hierarchy`, payload);
    } else {
      res = await (0,_utils__WEBPACK_IMPORTED_MODULE_11__.apiFetch)('POST', `/hierarchy/${selectedRegionId}`, payload);
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Save failed.');
    setRegionsList(prev => prev.map(r => r.id === selectedRegionId ? data : r));
    // After creating a draft, update the selected ID to the real one.
    if (selectedRegionId === -1) setSelectedRegionId(data.id);
    return data;
  }
  async function handleRegionDeleteById(id) {
    if (id === -1) {
      setRegionsList(prev => prev.filter(r => r.id !== -1));
      setSelectedRegionId(null);
      return;
    }
    const res = await (0,_utils__WEBPACK_IMPORTED_MODULE_11__.apiFetch)('DELETE', `/hierarchy/${id}`);
    if (!res.ok) throw new Error('Delete failed.');
    setRegionsList(prev => prev.filter(r => r.id !== id));
    if (selectedRegionId === id) setSelectedRegionId(null);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const pageTitle = isNew ? 'New Map' : `Edit: ${settings.title || '(no title)'}`;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
    className: "cns-map-editor",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_EditorHeader__WEBPACK_IMPORTED_MODULE_1__["default"], {
      pageTitle: pageTitle,
      overviewUrl: overviewUrl,
      viewUrl: !isNew && viewUrl ? viewUrl : '',
      status: settings.status,
      onStatusChange: s => setSettings(prev => ({
        ...prev,
        status: s
      })),
      saveStatus: saveStatus,
      onSave: handleSave
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
      className: "cns-map-editor__main",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
        className: "cns-map-editor__body",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_TabBar__WEBPACK_IMPORTED_MODULE_2__["default"], {
          activeTab: activeTab,
          isMaster: settings.isMaster,
          onChange: handleTabChange
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
          className: "cns-map-editor__content",
          children: [activeTab === 'settings' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_panels_SettingsPanel__WEBPACK_IMPORTED_MODULE_4__["default"], {
            settings: settings,
            onChange: setSettings
          }), activeTab === 'description' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_panels_DescriptionPanel__WEBPACK_IMPORTED_MODULE_5__["default"], {
            value: settings.description,
            onChange: html => setSettings(prev => ({
              ...prev,
              description: html
            }))
          }), activeTab === 'objects' && !settings.isMaster && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_panels_ObjectsPanel__WEBPACK_IMPORTED_MODULE_6__["default"], {
            mapId: mapId,
            settings: settings,
            objects: objectsList,
            selectedObjectId: selectedObjectId,
            repositioningObjectId: repositioningObjId,
            onObjectsLoaded: setObjectsList,
            onSelect: setSelectedObjectId,
            onDeselect: () => setSelectedObjectId(null),
            onAdd: handleObjectAdd,
            onPositionUpdate: handleObjectPositionUpdate,
            onLocalUpdate: handleObjectLocalUpdate,
            onDuplicate: handleObjectDuplicate,
            onRepositionStart: id => setRepositioningObjId(id),
            onRepositionComplete: () => setRepositioningObjId(null),
            onDelete: handleObjectDeleteById
          }), activeTab === 'areas' && !settings.isMaster && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_panels_AreasPanel__WEBPACK_IMPORTED_MODULE_7__["default"], {
            mapId: mapId,
            settings: settings,
            areas: areasList,
            selectedAreaId: selectedAreaId,
            onAreasLoaded: setAreasList,
            onSelect: setSelectedAreaId,
            onDeselect: () => setSelectedAreaId(null),
            onNodesUpdate: handleAreaNodesUpdate,
            onDuplicate: handleAreaDuplicate,
            onDelete: handleAreaDeleteById
          }), activeTab === 'labels' && !settings.isMaster && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_panels_LabelsPanel__WEBPACK_IMPORTED_MODULE_8__["default"], {
            mapId: mapId,
            settings: settings,
            labels: labelsList,
            selectedLabelId: selectedLabelId,
            repositioningLabelId: repositioningLabelId,
            onLabelsLoaded: setLabelsList,
            onSelect: setSelectedLabelId,
            onDeselect: () => setSelectedLabelId(null),
            onAdd: handleLabelAdd,
            onGeometryUpdate: handleLabelGeometryUpdate,
            onLocalUpdate: handleLabelLocalUpdate,
            onDuplicate: handleLabelDuplicate,
            onRepositionComplete: () => setRepositioningLabelId(null),
            onDelete: handleLabelDeleteById
          }), activeTab === 'hierarchy' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_panels_HierarchyPanel__WEBPACK_IMPORTED_MODULE_9__["default"], {
            mapId: mapId,
            settings: settings,
            regions: regionsList,
            selectedRegionId: selectedRegionId,
            parentMaps: initialParentMaps,
            onRegionsLoaded: setRegionsList,
            onSelect: setSelectedRegionId,
            onDeselect: () => setSelectedRegionId(null),
            onNodesUpdate: handleRegionNodesUpdate,
            onDelete: handleRegionDeleteById
          }), activeTab === 'preview' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_panels_PreviewPanel__WEBPACK_IMPORTED_MODULE_10__["default"], {
            settings: settings,
            objects: objectsList,
            areas: areasList,
            labels: labelsList,
            viewUrl: !isNew && viewUrl ? viewUrl : ''
          }), activeTab === 'stories' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("div", {
            id: "cns-map-stories-panel",
            "data-map-id": mapId,
            "data-overview-url": window.cnsMapEditorExtensions?.storySuiteOverviewUrl || ''
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_ContextPanel__WEBPACK_IMPORTED_MODULE_3__["default"], {
        activeTab: activeTab,
        selectedObject: selectedObject,
        selectedArea: selectedArea,
        selectedLabel: selectedLabel,
        selectedRegion: selectedRegion,
        onObjectSave: handleObjectSave,
        onObjectDelete: () => handleObjectDeleteById(selectedObjectId),
        onObjectClose: () => setSelectedObjectId(null),
        onObjectReposition: () => setRepositioningObjId(selectedObjectId),
        onObjectDuplicate: () => handleObjectDuplicate(selectedObjectId),
        onLabelSave: handleLabelSave,
        onLabelDelete: () => handleLabelDeleteById(selectedLabelId),
        onLabelClose: () => setSelectedLabelId(null),
        onLabelReposition: () => setRepositioningLabelId(selectedLabelId),
        onLabelDuplicate: () => handleLabelDuplicate(selectedLabelId),
        onLabelLocalUpdate: handleLabelLocalUpdate,
        onAreaSave: handleAreaSave,
        onAreaDelete: () => handleAreaDeleteById(selectedAreaId),
        onAreaClose: () => setSelectedAreaId(null),
        onAreaDuplicate: () => handleAreaDuplicate(selectedAreaId),
        onAreaNodesUpdate: handleAreaNodesUpdate,
        onAreaShapeTypeChange: handleAreaShapeTypeChange,
        onRegionSave: handleRegionSave,
        onRegionDelete: () => handleRegionDeleteById(selectedRegionId),
        onRegionClose: () => setSelectedRegionId(null),
        onRegionNodesUpdate: handleRegionNodesUpdate
      })]
    })]
  });
}

/***/ },

/***/ "./src/admin/app/TabBar.tsx"
/*!**********************************!*\
  !*** ./src/admin/app/TabBar.tsx ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TabBar)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

const TABS = [{
  id: 'settings',
  label: 'Settings',
  masterHide: false,
  masterShow: false
}, {
  id: 'description',
  label: 'Description',
  masterHide: false,
  masterShow: false
}, {
  id: 'objects',
  label: 'Objects',
  masterHide: true,
  masterShow: false
}, {
  id: 'areas',
  label: 'Areas',
  masterHide: true,
  masterShow: false
}, {
  id: 'labels',
  label: 'Labels',
  masterHide: true,
  masterShow: false
}, {
  id: 'hierarchy',
  label: 'Hierarchy',
  masterHide: false,
  masterShow: true
}, {
  id: 'preview',
  label: 'Preview',
  masterHide: true,
  masterShow: false
}, {
  id: 'stories',
  label: 'Stories',
  masterHide: true,
  masterShow: false,
  extensionKey: 'hasStorySuite'
}];
function TabBar({
  activeTab,
  isMaster,
  onChange
}) {
  const ext = window.cnsMapEditorExtensions || {};
  const visible = TABS.filter(t => {
    if (t.masterHide && isMaster) return false;
    if (t.masterShow && !isMaster) return false;
    if (t.extensionKey && !ext[t.extensionKey]) return false;
    return true;
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("nav", {
    className: "cns-map-editor__tabs",
    role: "tablist",
    "aria-label": "Editor modes",
    children: visible.map(t => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
      className: `cns-tab${activeTab === t.id ? ' cns-tab--active' : ''}`,
      role: "tab",
      "aria-selected": activeTab === t.id,
      onClick: () => onChange(t.id),
      children: t.label
    }, t.id))
  });
}

/***/ },

/***/ "./src/admin/app/canvases/AreasCanvas.tsx"
/*!************************************************!*\
  !*** ./src/admin/app/canvases/AreasCanvas.tsx ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AreasCanvas)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _areas__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../areas */ "./src/admin/areas.ts");
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../canvas */ "./src/admin/canvas.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils */ "./src/admin/utils.ts");
/* harmony import */ var _CanvasZoomWrap__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./CanvasZoomWrap */ "./src/admin/app/canvases/CanvasZoomWrap.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);






function commitNodePosition(canvas, area, idx, x, y) {
  return (0,_areas__WEBPACK_IMPORTED_MODULE_1__.moveAreaNode)(area, idx, x / canvas.width, y / canvas.height);
}
function AreasCanvas({
  drawState,
  areas,
  selectedAreaId,
  focusedNodeIdx,
  onSelect,
  onDeselect,
  onNodesChange,
  onNodeFocusChange
}) {
  const canvasRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const [repoNodeIdx, setRepoNodeIdx] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [repoCursor, setRepoCursor] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const stateRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    areas: [],
    selectedAreaId: null,
    focusedNodeIdx: null,
    onNodesChange,
    onDeselect,
    onNodeFocusChange,
    repoNodeIdx: null,
    repoCursor: null
  });
  stateRef.current = {
    areas,
    selectedAreaId,
    focusedNodeIdx,
    onNodesChange,
    onDeselect,
    onNodeFocusChange,
    repoNodeIdx,
    repoCursor
  };

  // ── Draw ────────────────────────────────────────────────────────────────────

  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    (0,_areas__WEBPACK_IMPORTED_MODULE_1__.drawAreasOnCanvas)(canvas, drawState, areas, selectedAreaId, repoNodeIdx, repoCursor, focusedNodeIdx);
  });

  // ── JSX event handlers — always read current props/state, no stale closures ──

  function handleMouseMove(e) {
    if (repoNodeIdx === null) return;
    setRepoCursor((0,_canvas__WEBPACK_IMPORTED_MODULE_2__.getCanvasCoords)(canvasRef.current, e.nativeEvent));
  }
  function handleClick(e) {
    const canvas = canvasRef.current;
    const {
      x,
      y
    } = (0,_canvas__WEBPACK_IMPORTED_MODULE_2__.getCanvasCoords)(canvas, e.nativeEvent);
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    if (repoNodeIdx !== null) {
      const area = areas.find(a => a.id === selectedAreaId);
      if (area) {
        onNodesChange?.(selectedAreaId, commitNodePosition(canvas, area, repoNodeIdx, x, y));
      }
      setRepoNodeIdx(null);
      setRepoCursor(null);
      return;
    }
    const selArea = selectedAreaId ? areas.find(a => a.id === selectedAreaId) : null;
    if (selArea) {
      const nIdx = (0,_areas__WEBPACK_IMPORTED_MODULE_1__.findNodeAtPoint)(ctx, x, y, selArea.nodes || [], W, H);
      if (nIdx !== -1) {
        setRepoNodeIdx(nIdx);
        setRepoCursor({
          x,
          y
        });
        // Keep keyboard focus in sync so Tab continues from here.
        onNodeFocusChange?.(nIdx);
        return;
      }
    }
    const hitArea = (0,_areas__WEBPACK_IMPORTED_MODULE_1__.findAreaAtPoint)(ctx, x, y, areas, W, H);
    if (hitArea) {
      onSelect?.(hitArea.id);
      return;
    }
    if (selArea) {
      const st = selArea.shape_type || 'POLYGON';
      if (st !== 'RECTANGLE' && st !== 'CIRCLE') {
        onNodesChange?.(selectedAreaId, [...selArea.nodes, {
          x: x / W,
          y: y / H
        }]);
      }
      return;
    }
    onDeselect?.();
  }

  // ── document keydown — bind once; reads live values via stateRef ─────────────

  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    function onKeyDown(e) {
      const {
        areas: areaList,
        selectedAreaId: selId,
        onNodesChange: onChange,
        onDeselect: deselect,
        repoNodeIdx: nodeIdx,
        repoCursor: cursor
      } = stateRef.current;
      if (e.key === 'Escape') {
        if (nodeIdx !== null) {
          setRepoNodeIdx(null);
          setRepoCursor(null);
        } else if (stateRef.current.focusedNodeIdx !== null) {
          stateRef.current.onNodeFocusChange?.(null);
        } else if (selId) {
          deselect?.();
        }
        return;
      }
      if (e.key !== 'Enter') return;
      // Enter already has a job in form fields and on focused
      // buttons/links — don't commit the node from there.
      if ((0,_utils__WEBPACK_IMPORTED_MODULE_3__.isTypingTarget)(e)) return;
      if (e.target?.closest?.('button, a')) return;
      if (nodeIdx !== null && cursor) {
        e.preventDefault();
        const area = areaList.find(a => a.id === selId);
        if (area && selId !== null) {
          onChange?.(selId, commitNodePosition(canvasRef.current, area, nodeIdx, cursor.x, cursor.y));
        }
      }
      setRepoNodeIdx(null);
      setRepoCursor(null);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);
  const isRepositioning = repoNodeIdx !== null;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
    className: `cns-objects-canvas-wrap${isRepositioning ? ' cns-canvas--repositioning' : ''}`,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_CanvasZoomWrap__WEBPACK_IMPORTED_MODULE_4__["default"], {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("canvas", {
        ref: canvasRef,
        onClick: handleClick,
        onMouseMove: handleMouseMove
      })
    })
  });
}

/***/ },

/***/ "./src/admin/app/canvases/CanvasZoomWrap.tsx"
/*!***************************************************!*\
  !*** ./src/admin/app/canvases/CanvasZoomWrap.tsx ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CanvasZoomWrap)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


/**
 * Zoom wrapper shared by all editor canvases. Zoom scales the canvas's
 * *display* size inside a scrollable viewport — the canvas backing store and
 * its pixel coordinate system are untouched, so every hit test and drag
 * keeps working: getCanvasCoords() already normalizes clicks by
 * boundingClientRect ÷ canvas.width.
 *
 * +/− buttons sit at the top right, outside the scroll area so they stay
 * put while panning. Zoom changes keep the viewport centered on the same
 * map point. The level is module-scoped so it survives tab switches.
 *
 * allowFullscreen adds a lightbox-style fullscreen toggle above the zoom
 * buttons (used by the Preview tab): the whole zoom wrap becomes a fixed
 * dark overlay, with zooming/panning still available. Esc exits.
 */
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.1;
let sharedZoom = 1;
function CanvasZoomWrap({
  children,
  allowFullscreen = false
}) {
  const [zoom, setZoom] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(sharedZoom);
  const [fullscreen, setFullscreen] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const scrollRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  function changeZoom(delta) {
    const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round((zoom + delta) * 10) / 10));
    if (next === zoom) return;
    sharedZoom = next;
    const scroll = scrollRef.current;
    // Map point currently at the viewport center, in zoom-1 units.
    const cx = scroll ? (scroll.scrollLeft + scroll.clientWidth / 2) / zoom : 0;
    const cy = scroll ? (scroll.scrollTop + scroll.clientHeight / 2) / zoom : 0;
    setZoom(next);
    // After the re-render resized the canvas, restore that center point.
    requestAnimationFrame(() => {
      if (!scroll) return;
      scroll.scrollLeft = cx * next - scroll.clientWidth / 2;
      scroll.scrollTop = cy * next - scroll.clientHeight / 2;
    });
  }

  // Fullscreen: lock body scroll, Esc exits.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!fullscreen) return;
    function onKeyDown(e) {
      if (e.key === 'Escape') setFullscreen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('cns-canvas-fullscreen-open');
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('cns-canvas-fullscreen-open');
    };
  }, [fullscreen]);
  const rootClass = 'cns-canvas-zoom' + (zoom > 1 ? ' cns-canvas-zoom--zoomed' : '') + (fullscreen ? ' is-fullscreen' : '');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: rootClass,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
      className: "cns-canvas-zoom__controls",
      children: [allowFullscreen && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
        type: "button",
        className: "button",
        onClick: () => setFullscreen(f => !f),
        "aria-label": fullscreen ? 'Exit fullscreen' : 'View fullscreen',
        children: fullscreen ? '✕' : '⛶'
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
        type: "button",
        className: "button",
        onClick: () => changeZoom(ZOOM_STEP),
        disabled: zoom >= MAX_ZOOM,
        "aria-label": "Zoom in",
        children: "+"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("span", {
        className: "cns-canvas-zoom__value",
        children: [Math.round(zoom * 100), "%"]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
        type: "button",
        className: "button",
        onClick: () => changeZoom(-ZOOM_STEP),
        disabled: zoom <= MIN_ZOOM,
        "aria-label": "Zoom out",
        children: "\u2212"
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "cns-canvas-zoom__scroll",
      ref: scrollRef,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        className: "cns-canvas-zoom__inner",
        style: zoom > 1 ? {
          width: `${zoom * 100}%`
        } : undefined,
        children: children
      })
    })]
  });
}

/***/ },

/***/ "./src/admin/app/canvases/HierarchyCanvas.tsx"
/*!****************************************************!*\
  !*** ./src/admin/app/canvases/HierarchyCanvas.tsx ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HierarchyCanvas)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../canvas */ "./src/admin/canvas.ts");
/* harmony import */ var _CanvasZoomWrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CanvasZoomWrap */ "./src/admin/app/canvases/CanvasZoomWrap.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




const NODE_HALF = 5;
function buildPolygonPath(ctx, nodes, W, H) {
  ctx.moveTo(nodes[0].x * W, nodes[0].y * H);
  for (let i = 1; i < nodes.length; i++) {
    ctx.lineTo(nodes[i].x * W, nodes[i].y * H);
  }
  ctx.closePath();
}
function drawRegion(ctx, region, W, H, isSelected, repoNodeIdx, repoCursor) {
  const nodes = region.nodes || [];
  if (nodes.length < 3) return;

  // Apply live cursor position for the node being dragged.
  let liveNodes = nodes;
  if (isSelected && repoNodeIdx !== null && repoCursor) {
    liveNodes = nodes.map(n => ({
      ...n
    }));
    liveNodes[repoNodeIdx] = {
      x: repoCursor.x / W,
      y: repoCursor.y / H
    };
  }
  const styles = region.canvas_styles || {};
  const fill = styles.fill || '#e8a020';
  const fillOpacity = styles.fillOpacity ?? 0.25;
  const stroke = styles.stroke || '#e8a020';
  const strokeWidth = styles.strokeWidth || 2;
  ctx.beginPath();
  buildPolygonPath(ctx, liveNodes, W, H);
  ctx.save();
  ctx.globalAlpha = fillOpacity;
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = isSelected ? Math.max(strokeWidth, 2) : strokeWidth;
  ctx.stroke();

  // Label: child map title centred inside region.
  if (region.child_map_title) {
    const cx = liveNodes.reduce((s, n) => s + n.x, 0) / liveNodes.length * W;
    const cy = liveNodes.reduce((s, n) => s + n.y, 0) / liveNodes.length * H;
    ctx.save();
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    ctx.lineWidth = 3;
    ctx.strokeText(region.child_map_title, cx, cy);
    ctx.fillText(region.child_map_title, cx, cy);
    ctx.restore();
  }
  if (!isSelected) return;

  // Node handles.
  liveNodes.forEach((node, idx) => {
    ctx.beginPath();
    ctx.rect(node.x * W - NODE_HALF, node.y * H - NODE_HALF, NODE_HALF * 2, NODE_HALF * 2);
    ctx.strokeStyle = repoNodeIdx === idx ? '#e75252' : '#e8a020';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}
async function drawHierarchyCanvas(canvas, drawState, regions, selectedRegionId, repoNodeIdx, repoCursor) {
  await (0,_canvas__WEBPACK_IMPORTED_MODULE_1__.drawMapCanvas)(canvas, drawState);
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  for (const region of regions) {
    const isSel = region.id === selectedRegionId;
    drawRegion(ctx, region, W, H, isSel, isSel ? repoNodeIdx : null, isSel ? repoCursor : null);
  }
}
function findRegionAtPoint(ctx, x, y, regions, W, H) {
  for (let i = regions.length - 1; i >= 0; i--) {
    const r = regions[i];
    const nodes = r.nodes || [];
    if (nodes.length < 3) continue;
    ctx.beginPath();
    buildPolygonPath(ctx, nodes, W, H);
    if (ctx.isPointInPath(x, y)) return r;
  }
  return null;
}
function findNodeAtPointLocal(ctx, x, y, nodes, W, H) {
  for (let i = nodes.length - 1; i >= 0; i--) {
    ctx.beginPath();
    ctx.rect(nodes[i].x * W - NODE_HALF, nodes[i].y * H - NODE_HALF, NODE_HALF * 2, NODE_HALF * 2);
    if (ctx.isPointInPath(x, y)) return i;
  }
  return -1;
}
function HierarchyCanvas({
  drawState,
  regions,
  selectedRegionId,
  onSelect,
  onDeselect,
  onNodesChange
}) {
  const canvasRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const [repoNodeIdx, setRepoNodeIdx] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [repoCursor, setRepoCursor] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const stateRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    regions: [],
    selectedRegionId: null,
    onNodesChange,
    repoNodeIdx: null,
    repoCursor: null
  });
  stateRef.current = {
    regions,
    selectedRegionId,
    onNodesChange,
    repoNodeIdx,
    repoCursor
  };
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawHierarchyCanvas(canvas, drawState, regions, selectedRegionId, repoNodeIdx, repoCursor);
  });
  function handleMouseMove(e) {
    if (repoNodeIdx === null) return;
    setRepoCursor((0,_canvas__WEBPACK_IMPORTED_MODULE_1__.getCanvasCoords)(canvasRef.current, e.nativeEvent));
  }
  function handleClick(e) {
    const canvas = canvasRef.current;
    const {
      x,
      y
    } = (0,_canvas__WEBPACK_IMPORTED_MODULE_1__.getCanvasCoords)(canvas, e.nativeEvent);
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    if (repoNodeIdx !== null) {
      const region = regions.find(r => r.id === selectedRegionId);
      if (region && selectedRegionId !== null) {
        const updated = region.nodes.map(n => ({
          ...n
        }));
        updated[repoNodeIdx] = {
          x: x / W,
          y: y / H
        };
        onNodesChange(selectedRegionId, updated);
      }
      setRepoNodeIdx(null);
      setRepoCursor(null);
      return;
    }
    const selRegion = selectedRegionId ? regions.find(r => r.id === selectedRegionId) : null;
    if (selRegion) {
      const nIdx = findNodeAtPointLocal(ctx, x, y, selRegion.nodes || [], W, H);
      if (nIdx !== -1) {
        setRepoNodeIdx(nIdx);
        setRepoCursor({
          x,
          y
        });
        return;
      }
    }
    const hitRegion = findRegionAtPoint(ctx, x, y, regions, W, H);
    if (hitRegion) {
      onSelect(hitRegion.id);
      return;
    }

    // Click empty space on selected region: add node.
    if (selRegion) {
      onNodesChange(selectedRegionId, [...selRegion.nodes, {
        x: x / W,
        y: y / H
      }]);
      return;
    }
    onDeselect();
  }
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    function onKeyDown(e) {
      const hierarchyActive = document.querySelector('[data-panel="hierarchy"].cns-tab-panel--active');
      if (!hierarchyActive) return;
      const {
        regions: regionList,
        selectedRegionId: selId,
        onNodesChange: onChange,
        repoNodeIdx: nodeIdx,
        repoCursor: cursor
      } = stateRef.current;
      if (e.key === 'Enter' && nodeIdx !== null && cursor) {
        const region = regionList.find(r => r.id === selId);
        if (region && selId !== null) {
          const updated = region.nodes.map(n => ({
            ...n
          }));
          updated[nodeIdx] = {
            x: cursor.x / canvasRef.current.width,
            y: cursor.y / canvasRef.current.height
          };
          onChange(selId, updated);
        }
      }
      if (e.key === 'Escape' || e.key === 'Enter') {
        setRepoNodeIdx(null);
        setRepoCursor(null);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);
  const isRepositioning = repoNodeIdx !== null;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    className: `cns-objects-canvas-wrap${isRepositioning ? ' cns-canvas--repositioning' : ''}`,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_CanvasZoomWrap__WEBPACK_IMPORTED_MODULE_2__["default"], {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("canvas", {
        ref: canvasRef,
        onClick: handleClick,
        onMouseMove: handleMouseMove
      })
    })
  });
}

/***/ },

/***/ "./src/admin/app/canvases/LabelsCanvas.tsx"
/*!*************************************************!*\
  !*** ./src/admin/app/canvases/LabelsCanvas.tsx ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LabelsCanvas)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _labels__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../labels */ "./src/admin/labels.ts");
/* harmony import */ var _usePickupDrag__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./usePickupDrag */ "./src/admin/app/canvases/usePickupDrag.ts");
/* harmony import */ var _CanvasZoomWrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CanvasZoomWrap */ "./src/admin/app/canvases/CanvasZoomWrap.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





/**
 * Pick-up/drop interaction comes from usePickupDrag; the drag payload names
 * the label and which part is carried:
 *
 *  - 'box'    — the text box. Centered labels move their anchor; indicator
 *               labels move only the box (offset), the dot stays put.
 *  - 'anchor' — the indicator dot; moves only the dot, the box stays put.
 *  - 'whole'  — anchor + box together (offset kept). Used by the
 *               "Reposition" button and Enter-pick-up.
 */

function applyDragCursor(label, part, cursor) {
  if (label.placement !== 'indicator' || part === 'whole') {
    // Centered labels and whole-label moves: the anchor follows the
    // cursor; in indicator mode the box tags along via the offset.
    return {
      ...label,
      x: Math.round(cursor.x),
      y: Math.round(cursor.y)
    };
  }
  if (part === 'box') {
    // Box follows the cursor, dot stays: cursor becomes anchor + offset.
    return {
      ...label,
      offset_x: Math.round(cursor.x - label.x),
      offset_y: Math.round(cursor.y - label.y)
    };
  }
  // part === 'anchor': dot follows the cursor, box stays at its absolute
  // position, so the offset compensates.
  const boxX = label.x + label.offset_x;
  const boxY = label.y + label.offset_y;
  return {
    ...label,
    x: Math.round(cursor.x),
    y: Math.round(cursor.y),
    offset_x: Math.round(boxX - cursor.x),
    offset_y: Math.round(boxY - cursor.y)
  };
}
function LabelsCanvas({
  drawState,
  labels,
  selectedLabelId,
  repositioningLabelId,
  onSelect,
  onDeselect,
  onGeometryUpdate,
  onRepositionComplete
}) {
  const stateRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    labels: [],
    selectedLabelId: null
  });
  stateRef.current = {
    labels,
    selectedLabelId
  };
  function liveLabel(id) {
    return stateRef.current.labels.find(l => l.id === id);
  }
  function redraw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const {
      labels: lbls,
      selectedLabelId: selId
    } = stateRef.current;
    const drag = dragRef.current;
    const list = drag && drag.cursor ? lbls.map(l => l.id === drag.payload.id ? applyDragCursor(l, drag.payload.part, drag.cursor) : l) : lbls;
    (0,_labels__WEBPACK_IMPORTED_MODULE_1__.drawLabelsOnCanvas)(canvas, drawState, list, selId);
  }
  const {
    canvasRef,
    dragRef,
    startDrag
  } = (0,_usePickupDrag__WEBPACK_IMPORTED_MODULE_2__.usePickupDrag)({
    hitTest: (ctx, x, y) => {
      const hit = (0,_labels__WEBPACK_IMPORTED_MODULE_1__.findLabelPartAtPoint)(ctx, x, y, stateRef.current.labels);
      return hit ? {
        id: hit.label.id,
        part: hit.part
      } : null;
    },
    onPickup: drag => onSelect?.(drag.id),
    onDrop: (drag, cursor) => {
      const label = liveLabel(drag.id);
      if (!label || !cursor) return; // never moved: nothing to commit
      const p = applyDragCursor(label, drag.part, cursor);
      void onGeometryUpdate?.(drag.id, {
        x: p.x,
        y: p.y,
        offset_x: p.offset_x,
        offset_y: p.offset_y
      });
    },
    dragFromSelection: () => stateRef.current.selectedLabelId ? {
      id: stateRef.current.selectedLabelId,
      part: 'whole'
    } : null,
    onEmptyClick: () => onDeselect?.(),
    onEscapeIdle: () => {
      if (stateRef.current.selectedLabelId) onDeselect?.();
    },
    onDragEnd: () => onRepositionComplete?.(),
    redraw
  });
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    redraw();
  }); // run after every render

  // The context panel's "Reposition" button starts a whole-label drag.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (repositioningLabelId) startDrag({
      id: repositioningLabelId,
      part: 'whole'
    });
  }, [repositioningLabelId]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
    className: "cns-objects-canvas-wrap",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_CanvasZoomWrap__WEBPACK_IMPORTED_MODULE_3__["default"], {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("canvas", {
        ref: canvasRef
      })
    })
  });
}

/***/ },

/***/ "./src/admin/app/canvases/ObjectsCanvas.tsx"
/*!**************************************************!*\
  !*** ./src/admin/app/canvases/ObjectsCanvas.tsx ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ObjectsCanvas)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _objects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../objects */ "./src/admin/objects.ts");
/* harmony import */ var _usePickupDrag__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./usePickupDrag */ "./src/admin/app/canvases/usePickupDrag.ts");
/* harmony import */ var _CanvasZoomWrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CanvasZoomWrap */ "./src/admin/app/canvases/CanvasZoomWrap.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





/**
 * Pick-up/drop interaction comes from usePickupDrag; here a drag payload is
 * simply the object id, and the preview draws the marker at the cursor.
 * Clicking empty canvas with nothing selected places a new object there.
 */

function ObjectsCanvas({
  drawState,
  objects,
  selectedObjectId,
  repositioningObjectId,
  onSelect,
  onDeselect,
  onPositionUpdate,
  onRepositionComplete,
  onPlace
}) {
  const stateRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    objects: [],
    selectedObjectId: null
  });
  stateRef.current = {
    objects,
    selectedObjectId
  };
  function redraw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const {
      objects: objs,
      selectedObjectId: selId
    } = stateRef.current;
    const drag = dragRef.current;
    (0,_objects__WEBPACK_IMPORTED_MODULE_1__.drawObjectsOnCanvas)(canvas, drawState, objs, selId, drag?.payload.id ?? null, drag?.cursor ?? null);
  }
  const {
    canvasRef,
    dragRef,
    startDrag
  } = (0,_usePickupDrag__WEBPACK_IMPORTED_MODULE_2__.usePickupDrag)({
    hitTest: (ctx, x, y) => {
      const hit = (0,_objects__WEBPACK_IMPORTED_MODULE_1__.findObjectAtPoint)(ctx, x, y, stateRef.current.objects);
      return hit ? {
        id: hit.id
      } : null;
    },
    onPickup: drag => onSelect?.(drag.id),
    onDrop: (drag, cursor) => {
      if (cursor) {
        void onPositionUpdate?.(drag.id, Math.round(cursor.x), Math.round(cursor.y));
      }
    },
    dragFromSelection: () => stateRef.current.selectedObjectId ? {
      id: stateRef.current.selectedObjectId
    } : null,
    onEmptyClick: coords => {
      if (stateRef.current.selectedObjectId) {
        onDeselect?.();
      } else {
        onPlace?.(Math.round(coords.x), Math.round(coords.y));
      }
    },
    onEscapeIdle: () => {
      if (stateRef.current.selectedObjectId) onDeselect?.();
    },
    onDragEnd: () => onRepositionComplete?.(),
    redraw
  });
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    redraw();
  }); // run after every render

  // The context panel's "Reposition" button starts a drag.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (repositioningObjectId) startDrag({
      id: repositioningObjectId
    });
  }, [repositioningObjectId]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
    className: "cns-objects-canvas-wrap",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_CanvasZoomWrap__WEBPACK_IMPORTED_MODULE_3__["default"], {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("canvas", {
        ref: canvasRef
      })
    })
  });
}

/***/ },

/***/ "./src/admin/app/canvases/PreviewCanvas.tsx"
/*!**************************************************!*\
  !*** ./src/admin/app/canvases/PreviewCanvas.tsx ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PreviewCanvas)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../canvas */ "./src/admin/canvas.ts");
/* harmony import */ var _CanvasZoomWrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CanvasZoomWrap */ "./src/admin/app/canvases/CanvasZoomWrap.tsx");
/* harmony import */ var _objects__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../objects */ "./src/admin/objects.ts");
/* harmony import */ var _areas__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../areas */ "./src/admin/areas.ts");
/* harmony import */ var _labels__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../labels */ "./src/admin/labels.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);







function PreviewCanvas({
  drawState,
  objects,
  areas,
  labels
}) {
  const canvasRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    (0,_canvas__WEBPACK_IMPORTED_MODULE_1__.drawFullCanvas)(canvas, objects, areas, drawState, _areas__WEBPACK_IMPORTED_MODULE_4__.drawAreaShape, _objects__WEBPACK_IMPORTED_MODULE_3__.drawObjectMarker).then(() => {
      const ctx = canvas.getContext('2d');
      // Match the frontend: labels without text are skipped.
      for (const label of labels) {
        if (label.text) (0,_labels__WEBPACK_IMPORTED_MODULE_5__.drawLabelShape)(ctx, label);
      }
    });
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
    className: "cns-canvas-wrap",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_CanvasZoomWrap__WEBPACK_IMPORTED_MODULE_2__["default"], {
      allowFullscreen: true,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("canvas", {
        ref: canvasRef
      })
    })
  });
}

/***/ },

/***/ "./src/admin/app/canvases/SettingsCanvas.tsx"
/*!***************************************************!*\
  !*** ./src/admin/app/canvases/SettingsCanvas.tsx ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SettingsCanvas)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../canvas */ "./src/admin/canvas.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



function SettingsCanvas({
  settings
}) {
  const canvasRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    (0,_canvas__WEBPACK_IMPORTED_MODULE_1__.drawMapCanvas)(canvas, {
      width: settings.width,
      aspectRatio: settings.aspectRatio,
      bgType: settings.bgType,
      bgColor: settings.bgColor,
      bgImageUrl: settings.bgImageUrl,
      imgUrl: settings.imageUrl,
      imageX: settings.imageX,
      imageY: settings.imageY,
      imageW: settings.imageW
    });
  }, [settings.width, settings.aspectRatio, settings.bgType, settings.bgColor, settings.bgImageUrl, settings.imageUrl, settings.imageX, settings.imageY, settings.imageW]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: "cns-settings-canvas",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("canvas", {
      ref: canvasRef
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
      className: "description",
      children: "Live preview \u2014 updates as you edit settings."
    })]
  });
}

/***/ },

/***/ "./src/admin/app/canvases/usePickupDrag.ts"
/*!*************************************************!*\
  !*** ./src/admin/app/canvases/usePickupDrag.ts ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   usePickupDrag: () => (/* binding */ usePickupDrag)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../canvas */ "./src/admin/canvas.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils */ "./src/admin/utils.ts");




/**
 * The shared pick-up / follow-cursor / drop interaction used by the Objects
 * and Labels canvases:
 *
 *   click a draggable thing → select it and pick it up (payload from hitTest)
 *   mousemove               → the preview follows the cursor (via redraw)
 *   click or Enter          → drop (onDrop with the final cursor position)
 *   Escape                  → cancel the drag, or fall through to onEscapeIdle
 *   Enter while idle        → pick up the current selection (dragFromSelection)
 *   hover                   → grab / grabbing cursors
 *
 * The payload D is opaque to the hook — canvases decide what a drag means
 * (an object id, a label part, …) and how the preview is rendered: redraw()
 * reads the returned dragRef. Enter is ignored in form fields and on focused
 * buttons/links, where it already has a job. Listeners bind once; config is
 * read through a ref so handlers always see the current render's props.
 */

function usePickupDrag(config) {
  const canvasRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const dragRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const cfgRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(config);
  cfgRef.current = config;
  function startDrag(payload) {
    dragRef.current = {
      payload,
      cursor: null
    };
    if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
    cfgRef.current.redraw();
  }
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    function endDrag() {
      dragRef.current = null;
      canvas.style.cursor = '';
      cfgRef.current.onDragEnd?.();
    }
    function onMouseMove(e) {
      const c = (0,_canvas__WEBPACK_IMPORTED_MODULE_1__.getCanvasCoords)(canvas, e);
      const drag = dragRef.current;
      if (!drag) {
        const ctx = canvas.getContext('2d');
        canvas.style.cursor = cfgRef.current.hitTest(ctx, c.x, c.y) ? 'grab' : '';
        return;
      }
      drag.cursor = c;
      cfgRef.current.redraw();
    }
    function onClick(e) {
      const coords = (0,_canvas__WEBPACK_IMPORTED_MODULE_1__.getCanvasCoords)(canvas, e);
      const ctx = canvas.getContext('2d');
      const drag = dragRef.current;
      if (drag) {
        const payload = drag.payload;
        endDrag();
        cfgRef.current.redraw();
        cfgRef.current.onDrop(payload, coords);
        return;
      }
      const hit = cfgRef.current.hitTest(ctx, coords.x, coords.y);
      if (hit !== null) {
        cfgRef.current.onPickup(hit);
        dragRef.current = {
          payload: hit,
          cursor: coords
        };
        canvas.style.cursor = 'grabbing';
        cfgRef.current.redraw();
        return;
      }
      cfgRef.current.onEmptyClick(coords);
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        if (dragRef.current) {
          endDrag();
          cfgRef.current.redraw();
        } else {
          cfgRef.current.onEscapeIdle();
        }
        return;
      }
      if (e.key !== 'Enter' || (0,_utils__WEBPACK_IMPORTED_MODULE_2__.isTypingTarget)(e)) return;
      if (e.target?.closest?.('button, a')) return;
      const drag = dragRef.current;
      if (drag) {
        e.preventDefault();
        const {
          payload,
          cursor
        } = drag;
        endDrag();
        cfgRef.current.redraw();
        cfgRef.current.onDrop(payload, cursor);
      } else {
        const payload = cfgRef.current.dragFromSelection();
        if (payload !== null) {
          e.preventDefault();
          startDrag(payload);
        }
      }
    }
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []); // bind once; cfgRef keeps values current

  return {
    canvasRef,
    dragRef,
    startDrag
  };
}

/***/ },

/***/ "./src/admin/app/forms/AreaForm.tsx"
/*!******************************************!*\
  !*** ./src/admin/app/forms/AreaForm.tsx ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AreaForm),
/* harmony export */   defaultAreaFormData: () => (/* binding */ defaultAreaFormData)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _shared_RangeField__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/RangeField */ "./src/admin/app/shared/RangeField.tsx");
/* harmony import */ var _shared_InfoboxSection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shared/InfoboxSection */ "./src/admin/app/forms/shared/InfoboxSection.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




const TYPES = [{
  value: 'GEOGRAPHY',
  label: 'Geography'
}, {
  value: 'HISTORY',
  label: 'History'
}, {
  value: 'NATURAL',
  label: 'Natural'
}, {
  value: 'EVENT',
  label: 'Event'
}, {
  value: 'OTHER',
  label: 'Other'
}];
const SHAPES = [{
  value: 'POLYGON',
  label: 'Polygon (Nodes)'
}, {
  value: 'RECTANGLE',
  label: 'Rectangle'
}, {
  value: 'BEZIER',
  label: 'Bezier Curve'
}, {
  value: 'CIRCLE',
  label: 'Circle / Oval'
}];
function AreaForm({
  formData,
  onChange,
  onShapeTypeChange
}) {
  const uid = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(Math.random().toString(36).slice(2));
  const n = uid.current;
  function set(key, val) {
    onChange({
      ...formData,
      [key]: val
    });
  }
  function handleShapeChange(e) {
    const st = e.target.value;
    set('shape_type', st);
    onShapeTypeChange?.(st);
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("section", {
      className: "cns-modal-section",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h3", {
        children: "Details"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "cns-form-grid",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "cns-form-row cns-form-row--full",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
            children: "Title"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
            type: "text",
            className: "large-text",
            value: formData.title,
            onChange: e => set('title', e.target.value)
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "cns-form-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
            children: "Type"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("select", {
            value: formData.type,
            onChange: e => set('type', e.target.value),
            children: TYPES.map(t => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
              value: t.value,
              children: t.label
            }, t.value))
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "cns-form-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
            children: "Shape"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("select", {
            value: formData.shape_type,
            onChange: handleShapeChange,
            children: SHAPES.map(s => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
              value: s.value,
              children: s.label
            }, s.value))
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "cns-form-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
            children: "Object Time"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
            type: "number",
            className: "small-text",
            value: formData.object_time,
            onChange: e => set('object_time', parseInt(e.target.value, 10) || 0)
          })]
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_shared_InfoboxSection__WEBPACK_IMPORTED_MODULE_2__["default"], {
      formData: formData,
      onChange: onChange
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("section", {
      className: "cns-modal-section",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h3", {
        children: "Design"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "cns-form-grid",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "cns-form-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
            children: "Fill Color"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
            type: "color",
            value: formData.style_fill,
            onChange: e => set('style_fill', e.target.value)
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "cns-form-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
            children: "Fill Opacity"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_shared_RangeField__WEBPACK_IMPORTED_MODULE_1__["default"], {
            min: 0,
            max: 1,
            step: 0.05,
            value: parseFloat(String(formData.style_fill_opacity)),
            onChange: v => set('style_fill_opacity', v)
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "cns-form-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
            children: "Stroke Color"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
            type: "color",
            value: formData.style_stroke,
            onChange: e => set('style_stroke', e.target.value)
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "cns-form-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
            children: "Stroke Width (px)"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
            type: "number",
            className: "small-text",
            min: "1",
            max: "10",
            value: formData.style_stroke_width,
            onChange: e => set('style_stroke_width', parseInt(e.target.value, 10) || 2)
          })]
        })]
      })]
    })]
  });
}
function defaultAreaFormData(area) {
  const styles = area?.canvas_styles || {};
  return {
    title: area?.title || '',
    type: area?.type || 'GEOGRAPHY',
    shape_type: area?.shape_type || 'POLYGON',
    object_time: area?.object_time ?? 0,
    ...(0,_shared_InfoboxSection__WEBPACK_IMPORTED_MODULE_2__.infoboxFormDefaults)(area ?? null),
    style_fill: styles.fill || '#2271b1',
    style_fill_opacity: styles.fillOpacity ?? 0.3,
    style_stroke: styles.stroke || '#2271b1',
    style_stroke_width: styles.strokeWidth || 2
  };
}

/***/ },

/***/ "./src/admin/app/forms/HierarchyRegionForm.tsx"
/*!*****************************************************!*\
  !*** ./src/admin/app/forms/HierarchyRegionForm.tsx ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HierarchyRegionForm),
/* harmony export */   defaultHierarchyFormData: () => (/* binding */ defaultHierarchyFormData)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _shared_RangeField__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/RangeField */ "./src/admin/app/shared/RangeField.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



// ── Map search (filters to 'maps' CPT only) ───────────────────────────────────

function MapSearch({
  childMapId,
  childMapLabel,
  onChange
}) {
  const [query, setQuery] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [results, setResults] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [open, setOpen] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const timer = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  function handleInput(e) {
    const val = e.target.value;
    setQuery(val);
    if (timer.current) clearTimeout(timer.current);
    if (val.length < 2) {
      setOpen(false);
      return;
    }
    timer.current = setTimeout(async () => {
      try {
        const url = window.cnsMapSuite.wpRestUrl + '/search?search=' + encodeURIComponent(val) + '&type=post&subtype=maps&per_page=10';
        const res = await fetch(url, {
          headers: {
            'X-WP-Nonce': window.cnsMapSuite.nonce
          }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setResults(data);
          setOpen(true);
        }
      } catch {/* silent */}
    }, 350);
  }
  function selectResult(item) {
    onChange({
      id: item.id,
      title: item.title
    });
    setQuery('');
    setResults([]);
    setOpen(false);
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: "cns-post-search-wrap",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
      children: "Child Map"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
      type: "text",
      className: "large-text",
      placeholder: "Search maps\u2026",
      autoComplete: "off",
      value: query,
      onChange: handleInput
    }), open && results.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "cns-post-results",
      children: results.map(item => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
        type: "button",
        className: "cns-post-result",
        onClick: () => selectResult(item),
        children: item.title
      }, item.id))
    }), childMapId > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("p", {
      className: "description",
      children: [childMapLabel || `Map ID: ${childMapId}`, ' ', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
        type: "button",
        className: "button button-small",
        onClick: () => onChange({
          id: 0,
          title: ''
        }),
        children: "Clear"
      })]
    })]
  });
}

// ── Form ──────────────────────────────────────────────────────────────────────

function HierarchyRegionForm({
  formData,
  onChange
}) {
  function set(key, val) {
    onChange({
      ...formData,
      [key]: val
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("section", {
      className: "cns-modal-section",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h3", {
        children: "Child Map"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(MapSearch, {
        childMapId: formData.child_map_id,
        childMapLabel: formData.child_map_label,
        onChange: item => onChange({
          ...formData,
          child_map_id: item ? item.id : 0,
          child_map_label: item ? item.title : ''
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("section", {
      className: "cns-modal-section",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h3", {
        children: "Infobox Override"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
        className: "description",
        children: "Leave blank to use the child map's title and excerpt."
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "cns-form-grid",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "cns-form-row cns-form-row--full",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
            children: "Title"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
            type: "text",
            className: "large-text",
            value: formData.title_override,
            placeholder: formData.child_map_label || 'Child map title',
            onChange: e => set('title_override', e.target.value)
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "cns-form-row cns-form-row--full",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
            children: "Description"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("textarea", {
            rows: 3,
            className: "large-text",
            value: formData.description_override,
            placeholder: "Child map excerpt",
            onChange: e => set('description_override', e.target.value)
          })]
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("section", {
      className: "cns-modal-section",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h3", {
        children: "Region Style"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "cns-form-grid",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "cns-form-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
            children: "Fill Color"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
            type: "color",
            value: formData.style_fill,
            onChange: e => set('style_fill', e.target.value)
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "cns-form-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
            children: "Fill Opacity"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_shared_RangeField__WEBPACK_IMPORTED_MODULE_1__["default"], {
            min: 0,
            max: 1,
            step: 0.05,
            value: parseFloat(String(formData.style_fill_opacity)),
            onChange: v => set('style_fill_opacity', v)
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "cns-form-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
            children: "Stroke Color"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
            type: "color",
            value: formData.style_stroke,
            onChange: e => set('style_stroke', e.target.value)
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "cns-form-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
            children: "Stroke Width (px)"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
            type: "number",
            className: "small-text",
            min: "1",
            max: "10",
            value: formData.style_stroke_width,
            onChange: e => set('style_stroke_width', parseInt(e.target.value, 10) || 2)
          })]
        })]
      })]
    })]
  });
}
function defaultHierarchyFormData(region) {
  const styles = region?.canvas_styles || {};
  return {
    child_map_id: region?.child_map_id || 0,
    child_map_label: region?.child_map_title || '',
    title_override: region?.title_override || '',
    description_override: region?.description_override || '',
    style_fill: styles.fill || '#e8a020',
    style_fill_opacity: styles.fillOpacity ?? 0.25,
    style_stroke: styles.stroke || '#e8a020',
    style_stroke_width: styles.strokeWidth || 2
  };
}

/***/ },

/***/ "./src/admin/app/forms/LabelForm.tsx"
/*!*******************************************!*\
  !*** ./src/admin/app/forms/LabelForm.tsx ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   collectLabelPayload: () => (/* binding */ collectLabelPayload),
/* harmony export */   "default": () => (/* binding */ LabelForm),
/* harmony export */   defaultLabelFormData: () => (/* binding */ defaultLabelFormData)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _shared_RangeField__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/RangeField */ "./src/admin/app/shared/RangeField.tsx");
/* harmony import */ var _shared_InfoboxSection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shared/InfoboxSection */ "./src/admin/app/forms/shared/InfoboxSection.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




function LabelForm({
  formData,
  onChange
}) {
  const uid = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(Math.random().toString(36).slice(2));
  const n = uid.current;
  function set(key, val) {
    onChange({
      ...formData,
      [key]: val
    });
  }
  const isIndicator = formData.placement === 'indicator';
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("section", {
      className: "cns-modal-section",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h3", {
        children: "Label"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "cns-form-grid",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "cns-form-row cns-form-row--full",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
            children: "Text"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
            type: "text",
            className: "large-text",
            value: formData.text,
            onChange: e => set('text', e.target.value)
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "cns-form-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
            children: "Label Time"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
            type: "number",
            className: "small-text",
            value: formData.object_time,
            onChange: e => set('object_time', parseInt(e.target.value, 10) || 0)
          })]
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("section", {
      className: "cns-modal-section",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h3", {
        children: "Placement"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "cns-radio-toggle",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("label", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
            type: "radio",
            name: `label-placement-${n}`,
            value: "centered",
            checked: !isIndicator,
            onChange: () => set('placement', 'centered')
          }), ' ', "Centered on point"]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("label", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
            type: "radio",
            name: `label-placement-${n}`,
            value: "indicator",
            checked: isIndicator,
            onChange: () => set('placement', 'indicator')
          }), ' ', "Indicator (line & dot)"]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "cns-form-grid",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "cns-form-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
            children: "X (px)"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
            type: "number",
            className: "small-text",
            value: formData.x,
            onChange: e => set('x', parseInt(e.target.value, 10) || 0)
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "cns-form-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
            children: "Y (px)"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
            type: "number",
            className: "small-text",
            value: formData.y,
            onChange: e => set('y', parseInt(e.target.value, 10) || 0)
          })]
        }), isIndicator && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "cns-form-row",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
              children: "Label Offset X (px)"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
              type: "number",
              className: "small-text",
              value: formData.offset_x,
              onChange: e => set('offset_x', parseInt(e.target.value, 10) || 0)
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "cns-form-row",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
              children: "Label Offset Y (px)"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
              type: "number",
              className: "small-text",
              value: formData.offset_y,
              onChange: e => set('offset_y', parseInt(e.target.value, 10) || 0)
            })]
          })]
        })]
      }), isIndicator && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
        className: "description",
        children: "The dot marks the X/Y point; the label box sits at the offset, connected by a line."
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_shared_InfoboxSection__WEBPACK_IMPORTED_MODULE_2__["default"], {
      formData: formData,
      onChange: onChange
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
      className: "description",
      children: "Labels with infobox content open the infobox drawer when clicked on the map; labels without stay purely decorative."
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("section", {
      className: "cns-modal-section",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h3", {
        children: "Design"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "cns-form-grid",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "cns-form-row cns-form-row--full",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
            children: "Font Size (px)"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_shared_RangeField__WEBPACK_IMPORTED_MODULE_1__["default"], {
            min: 8,
            max: 64,
            step: 1,
            value: formData.style_font_size,
            onChange: v => set('style_font_size', v)
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "cns-form-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
            children: "Background Color"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
            type: "color",
            value: formData.style_bg,
            onChange: e => set('style_bg', e.target.value)
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "cns-form-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
            children: "Border Color"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
            type: "color",
            value: formData.style_border,
            onChange: e => set('style_border', e.target.value)
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "cns-form-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
            children: "Text Color"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
            type: "color",
            value: formData.style_text_color,
            onChange: e => set('style_text_color', e.target.value)
          })]
        })]
      })]
    })]
  });
}
function defaultLabelFormData(label, x, y) {
  return {
    text: label?.text || '',
    placement: label?.placement || 'centered',
    x: label ? label.x : x ?? 0,
    y: label ? label.y : y ?? 0,
    offset_x: label?.offset_x ?? 40,
    offset_y: label?.offset_y ?? -40,
    object_time: label?.object_time ?? 0,
    ...(0,_shared_InfoboxSection__WEBPACK_IMPORTED_MODULE_2__.infoboxFormDefaults)(label),
    style_bg: label?.canvas_styles?.bgColor || '#ffffff',
    style_border: label?.canvas_styles?.borderColor || '#1e1e1e',
    style_text_color: label?.canvas_styles?.textColor || '#1e1e1e',
    style_font_size: label?.canvas_styles?.fontSize || 14
  };
}
function collectLabelPayload(formData) {
  const {
    infobox_image_url,
    linked_post_label,
    ...payload
  } = formData;
  return payload;
}

/***/ },

/***/ "./src/admin/app/forms/NodeList.tsx"
/*!******************************************!*\
  !*** ./src/admin/app/forms/NodeList.tsx ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NodeList)
/* harmony export */ });
/* harmony import */ var _areas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../areas */ "./src/admin/areas.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


const NODE_LABELS = {
  RECTANGLE: ['TL', 'TR', 'BR', 'BL'],
  CIRCLE: ['Center', 'Edge']
};
function NodeList({
  area,
  onNodesChange
}) {
  const nodes = area.nodes || [];
  const shapeType = area.shape_type || 'POLYGON';
  const isFixed = shapeType === 'RECTANGLE' || shapeType === 'CIRCLE';
  const labels = NODE_LABELS[shapeType] || null;
  function updateNode(idx, axis, rawVal) {
    const val = Math.max(0, Math.min(100, parseFloat(rawVal) || 0)) / 100;
    let updated = nodes.map(n => ({
      ...n
    }));
    if (shapeType === 'RECTANGLE') {
      const newX = axis === 'x' ? val : updated[idx].x;
      const newY = axis === 'y' ? val : updated[idx].y;
      updated = (0,_areas__WEBPACK_IMPORTED_MODULE_0__.applyRectangleConstraint)(updated, idx, newX, newY) || updated;
    } else if (shapeType === 'CIRCLE' && idx === 0) {
      const dx = (axis === 'x' ? val : updated[0].x) - updated[0].x;
      const dy = (axis === 'y' ? val : updated[0].y) - updated[0].y;
      updated[0] = {
        x: updated[0].x + dx,
        y: updated[0].y + dy
      };
      if (updated[1]) updated[1] = {
        x: updated[1].x + dx,
        y: updated[1].y + dy
      };
    } else {
      updated[idx] = {
        ...updated[idx],
        [axis]: val
      };
    }
    onNodesChange(updated);
  }
  function addNode() {
    onNodesChange([...nodes, {
      x: 0.5,
      y: 0.5
    }]);
  }
  function deleteNode(idx) {
    onNodesChange(nodes.filter((_, i) => i !== idx));
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("section", {
    className: "cns-modal-section cns-nodes-section",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("h3", {
      children: ["Nodes", !isFixed && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
        type: "button",
        className: "button button-small cns-nodes-add-btn",
        onClick: addNode,
        children: "+ Add Node"
      })]
    }), nodes.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
      className: "description",
      children: "No nodes yet. Click the canvas to add nodes."
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("table", {
      className: "cns-nodes-table",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("thead", {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("tr", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("th", {
            children: "#"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("th", {
            children: "X\xA0%"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("th", {
            children: "Y\xA0%"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("th", {})]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("tbody", {
        children: nodes.map((node, idx) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("tr", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td", {
            className: "cns-node-num",
            children: labels ? labels[idx] ?? idx + 1 : idx + 1
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
              type: "number",
              className: "small-text cns-node-x",
              value: (node.x * 100).toFixed(1),
              min: "0",
              max: "100",
              step: "0.1",
              onChange: e => updateNode(idx, 'x', e.target.value)
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
              type: "number",
              className: "small-text cns-node-y",
              value: (node.y * 100).toFixed(1),
              min: "0",
              max: "100",
              step: "0.1",
              onChange: e => updateNode(idx, 'y', e.target.value)
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td", {
            children: !isFixed && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
              type: "button",
              className: "button button-small cns-node-del",
              onClick: () => deleteNode(idx),
              children: "\xD7"
            })
          })]
        }, idx))
      })]
    })]
  });
}

/***/ },

/***/ "./src/admin/app/forms/ObjectForm.tsx"
/*!********************************************!*\
  !*** ./src/admin/app/forms/ObjectForm.tsx ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   collectObjectPayload: () => (/* binding */ collectObjectPayload),
/* harmony export */   "default": () => (/* binding */ ObjectForm),
/* harmony export */   defaultObjectFormData: () => (/* binding */ defaultObjectFormData)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _shared_MediaPicker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/MediaPicker */ "./src/admin/app/shared/MediaPicker.tsx");
/* harmony import */ var _shared_IconPicker__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/IconPicker */ "./src/admin/app/shared/IconPicker.tsx");
/* harmony import */ var _shared_RangeField__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shared/RangeField */ "./src/admin/app/shared/RangeField.tsx");
/* harmony import */ var _shared_InfoboxSection__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./shared/InfoboxSection */ "./src/admin/app/forms/shared/InfoboxSection.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);






const TYPES = [{
  value: 'LOCATION',
  label: 'Location'
}, {
  value: 'HISTORY',
  label: 'History'
}, {
  value: 'NATURAL',
  label: 'Natural'
}, {
  value: 'EVENT',
  label: 'Event'
}, {
  value: 'OTHER',
  label: 'Other'
}];
function ObjectForm({
  formData,
  onChange,
  icons
}) {
  const uid = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(Math.random().toString(36).slice(2));
  const n = uid.current;
  function set(key, val) {
    onChange({
      ...formData,
      [key]: val
    });
  }
  const isSvgSource = formData.icon_source !== 'image';
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("section", {
      className: "cns-modal-section",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("h3", {
        children: "Icon"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        className: "cns-radio-toggle",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("label", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
            type: "radio",
            name: `obj-icon-src-${n}`,
            value: "svg",
            checked: isSvgSource,
            onChange: () => set('icon_source', 'svg')
          }), ' ', "From library"]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("label", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
            type: "radio",
            name: `obj-icon-src-${n}`,
            value: "image",
            checked: !isSvgSource,
            onChange: () => set('icon_source', 'image')
          }), ' ', "Custom image"]
        })]
      }), isSvgSource && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_shared_IconPicker__WEBPACK_IMPORTED_MODULE_2__["default"], {
          icons: icons,
          selectedIconId: formData.icon_image_id_svg,
          onSelect: id => set('icon_image_id_svg', id)
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
          className: "description",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("a", {
            href: window.cnsMapSuite.iconsUrl,
            target: "_blank",
            rel: "noreferrer",
            children: "Manage icon library \u2192"
          })
        })]
      }), !isSvgSource && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_shared_MediaPicker__WEBPACK_IMPORTED_MODULE_1__["default"], {
        imageId: formData.icon_image_id_custom,
        imageUrl: formData.icon_image_url,
        title: "Select Icon Image",
        onChange: att => onChange({
          ...formData,
          icon_image_id_custom: att ? att.id : 0,
          icon_image_url: att ? att.url : ''
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("section", {
      className: "cns-modal-section",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("h3", {
        children: "Details"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        className: "cns-form-grid",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          className: "cns-form-row cns-form-row--full",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("label", {
            children: "Title"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
            type: "text",
            className: "large-text",
            value: formData.title,
            onChange: e => set('title', e.target.value)
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          className: "cns-form-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("label", {
            children: "Type"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("select", {
            value: formData.type,
            onChange: e => set('type', e.target.value),
            children: TYPES.map(t => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("option", {
              value: t.value,
              children: t.label
            }, t.value))
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          className: "cns-form-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("label", {
            children: "Object Time"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
            type: "number",
            className: "small-text",
            value: formData.object_time,
            onChange: e => set('object_time', parseInt(e.target.value, 10) || 0)
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          className: "cns-form-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("label", {
            children: "X (px)"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
            type: "number",
            className: "small-text",
            value: formData.x,
            onChange: e => set('x', parseInt(e.target.value, 10) || 0)
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          className: "cns-form-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("label", {
            children: "Y (px)"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
            type: "number",
            className: "small-text",
            value: formData.y,
            onChange: e => set('y', parseInt(e.target.value, 10) || 0)
          })]
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_shared_InfoboxSection__WEBPACK_IMPORTED_MODULE_4__["default"], {
      formData: formData,
      onChange: onChange
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("section", {
      className: "cns-modal-section",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("h3", {
        children: "Design"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        className: "cns-form-grid",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          className: "cns-form-row cns-form-row--full",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("label", {
            children: "Icon Size (px)"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_shared_RangeField__WEBPACK_IMPORTED_MODULE_3__["default"], {
            min: 8,
            max: 128,
            step: 1,
            value: formData.style_size,
            onChange: v => set('style_size', v)
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          className: "cns-form-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("label", {
            children: "Fill Color"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
            type: "color",
            value: formData.style_fill,
            onChange: e => set('style_fill', e.target.value)
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          className: "cns-form-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("label", {
            children: "Stroke Color"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
            type: "color",
            value: formData.style_stroke,
            onChange: e => set('style_stroke', e.target.value)
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
        className: "description",
        children: "Fill and stroke are applied to SVG icons only."
      })]
    })]
  });
}
function defaultObjectFormData(obj, x, y) {
  const isSvg = !obj || !obj.icon_image_id || obj.icon_mime === 'image/svg+xml';
  return {
    icon_source: isSvg ? 'svg' : 'image',
    icon_image_id_svg: isSvg && obj?.icon_image_id ? obj.icon_image_id : null,
    icon_image_id_custom: !isSvg && obj?.icon_image_id ? obj.icon_image_id : 0,
    icon_image_url: obj?.icon_url && !isSvg ? obj.icon_url : '',
    title: obj?.title || '',
    type: obj?.type || 'LOCATION',
    object_time: obj?.object_time ?? 0,
    x: obj ? obj.x : x ?? 0,
    y: obj ? obj.y : y ?? 0,
    ...(0,_shared_InfoboxSection__WEBPACK_IMPORTED_MODULE_4__.infoboxFormDefaults)(obj),
    style_size: obj?.canvas_styles?.size || 32,
    style_fill: obj?.canvas_styles?.fillStyle || '#ffffff',
    style_stroke: obj?.canvas_styles?.strokeStyle || '#2271b1'
  };
}
function collectObjectPayload(formData) {
  const iconImageId = formData.icon_source === 'svg' ? formData.icon_image_id_svg || 0 : formData.icon_image_id_custom || 0;
  return {
    icon_image_id: iconImageId,
    title: formData.title || '',
    type: formData.type || 'LOCATION',
    x: formData.x || 0,
    y: formData.y || 0,
    object_time: formData.object_time || 0,
    infobox_source: formData.infobox_source || 'manual',
    linked_post_id: formData.linked_post_id || 0,
    infobox_title: formData.infobox_title || '',
    infobox_description: formData.infobox_description || '',
    infobox_image_id: formData.infobox_image_id || 0,
    style_size: formData.style_size || 32,
    style_fill: formData.style_fill || '#ffffff',
    style_stroke: formData.style_stroke || '#2271b1'
  };
}

/***/ },

/***/ "./src/admin/app/forms/RegionNodeList.tsx"
/*!************************************************!*\
  !*** ./src/admin/app/forms/RegionNodeList.tsx ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RegionNodeList)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

function RegionNodeList({
  region,
  onNodesChange
}) {
  const nodes = region.nodes || [];
  function updateNode(idx, axis, rawVal) {
    const val = Math.max(0, Math.min(100, parseFloat(rawVal) || 0)) / 100;
    const updated = nodes.map(n => ({
      ...n
    }));
    updated[idx] = {
      ...updated[idx],
      [axis]: val
    };
    onNodesChange(updated);
  }
  function addNode() {
    onNodesChange([...nodes, {
      x: 0.5,
      y: 0.5
    }]);
  }
  function deleteNode(idx) {
    onNodesChange(nodes.filter((_, i) => i !== idx));
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("section", {
    className: "cns-modal-section cns-nodes-section",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("h3", {
      children: ["Nodes", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
        type: "button",
        className: "button button-small cns-nodes-add-btn",
        onClick: addNode,
        children: "+ Add Node"
      })]
    }), nodes.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
      className: "description",
      children: "No nodes yet. Click the canvas to add nodes."
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("table", {
      className: "cns-nodes-table",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("thead", {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("tr", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("th", {
            children: "#"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("th", {
            children: "X\xA0%"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("th", {
            children: "Y\xA0%"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("th", {})]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("tbody", {
        children: nodes.map((node, idx) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("tr", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("td", {
            className: "cns-node-num",
            children: idx + 1
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("td", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", {
              type: "number",
              className: "small-text cns-node-x",
              value: (node.x * 100).toFixed(1),
              min: "0",
              max: "100",
              step: "0.1",
              onChange: e => updateNode(idx, 'x', e.target.value)
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("td", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", {
              type: "number",
              className: "small-text cns-node-y",
              value: (node.y * 100).toFixed(1),
              min: "0",
              max: "100",
              step: "0.1",
              onChange: e => updateNode(idx, 'y', e.target.value)
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("td", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
              type: "button",
              className: "button button-small cns-node-del",
              onClick: () => deleteNode(idx),
              children: "\xD7"
            })
          })]
        }, idx))
      })]
    })]
  });
}

/***/ },

/***/ "./src/admin/app/forms/shared/InfoboxSection.tsx"
/*!*******************************************************!*\
  !*** ./src/admin/app/forms/shared/InfoboxSection.tsx ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ InfoboxSection),
/* harmony export */   infoboxFormDefaults: () => (/* binding */ infoboxFormDefaults)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _shared_MediaPicker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shared/MediaPicker */ "./src/admin/app/shared/MediaPicker.tsx");
/* harmony import */ var _shared_PostSearch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/PostSearch */ "./src/admin/app/shared/PostSearch.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




/**
 * The Infobox form section shared by the object, area, and label forms.
 * One model everywhere: an optional connected post (adds a "Read more" link
 * to the frontend drawer regardless of source) and a radio that only picks
 * where the content comes from — written manually or pulled from that post.
 */

function InfoboxSection({
  formData,
  onChange
}) {
  const uid = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(Math.random().toString(36).slice(2));
  const n = uid.current;
  const isManualIb = formData.infobox_source !== 'post';
  function set(key, val) {
    onChange({
      ...formData,
      [key]: val
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("section", {
    className: "cns-modal-section",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h3", {
      children: "Infobox"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_shared_PostSearch__WEBPACK_IMPORTED_MODULE_2__["default"], {
      linkedPostId: formData.linked_post_id,
      linkedPostLabel: formData.linked_post_label,
      onChange: item => onChange({
        ...formData,
        linked_post_id: item ? item.id : 0,
        linked_post_label: item ? item.title : ''
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
      className: "description",
      children: "Optional \u2014 a connected post adds a \u201CRead more\u201D link to the infobox."
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "cns-radio-toggle",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("label", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
          type: "radio",
          name: `ib-src-${n}`,
          value: "manual",
          checked: isManualIb,
          onChange: () => set('infobox_source', 'manual')
        }), ' ', "Write content manually"]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("label", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
          type: "radio",
          name: `ib-src-${n}`,
          value: "post",
          checked: !isManualIb,
          onChange: () => set('infobox_source', 'post')
        }), ' ', "Use the connected post\u2019s content"]
      })]
    }), isManualIb && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "cns-form-grid",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "cns-form-row cns-form-row--full",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
          children: "Infobox Title"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
          type: "text",
          className: "large-text",
          value: formData.infobox_title,
          onChange: e => set('infobox_title', e.target.value)
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "cns-form-row cns-form-row--full",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
          children: "Description"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("textarea", {
          rows: 4,
          className: "large-text",
          value: formData.infobox_description,
          onChange: e => set('infobox_description', e.target.value)
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "cns-form-row cns-form-row--full",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
          children: "Infobox Image"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_shared_MediaPicker__WEBPACK_IMPORTED_MODULE_1__["default"], {
          imageId: formData.infobox_image_id,
          imageUrl: formData.infobox_image_url,
          title: "Select Infobox Image",
          onChange: att => onChange({
            ...formData,
            infobox_image_id: att ? att.id : 0,
            infobox_image_url: att ? att.url : ''
          })
        })]
      })]
    }), !isManualIb && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
      className: "description",
      children: "Title, description and image are pulled from the connected post."
    })]
  });
}

/** Default infobox form values for an existing item (or null for a new one). */
function infoboxFormDefaults(item) {
  return {
    infobox_source: item?.infobox_source || 'manual',
    infobox_title: item?.infobox_data?.title || '',
    infobox_description: item?.infobox_data?.description || '',
    infobox_image_id: item?.infobox_data?.image_id || 0,
    infobox_image_url: '',
    linked_post_id: item?.linked_post_id || 0,
    linked_post_label: item?.linked_post_id ? `Post ID: ${item.linked_post_id}` : ''
  };
}

/***/ },

/***/ "./src/admin/app/lists/AreasList.tsx"
/*!*******************************************!*\
  !*** ./src/admin/app/lists/AreasList.tsx ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AreasList)
/* harmony export */ });
/* harmony import */ var _EntityTable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EntityTable */ "./src/admin/app/lists/EntityTable.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


const COLUMNS = [{
  header: 'Title',
  render: area => area.title || '(no title)'
}, {
  header: 'Type',
  render: area => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
    className: "cns-badge cns-badge--type",
    children: area.type
  })
}, {
  header: 'Nodes',
  render: area => `${(area.nodes || []).length} nodes`
}];
function AreasList({
  areas,
  onSelect,
  onDuplicate,
  onDelete
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_EntityTable__WEBPACK_IMPORTED_MODULE_0__["default"], {
    items: areas,
    columns: COLUMNS,
    emptyText: 'No areas yet. Click “Add Area” to create one.',
    renderActions: area => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
        className: "button button-small",
        onClick: () => onSelect(area.id),
        children: "Edit"
      }), ' ', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
        className: "button button-small",
        onClick: () => onDuplicate(area.id),
        children: "Duplicate"
      }), ' ', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
        className: "button button-small",
        onClick: () => onDelete(area.id),
        children: "Delete"
      })]
    })
  });
}

/***/ },

/***/ "./src/admin/app/lists/EntityTable.tsx"
/*!*********************************************!*\
  !*** ./src/admin/app/lists/EntityTable.tsx ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EntityTable)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

/**
 * Generic list table for the entity tabs (objects / areas / labels): the
 * per-entity lists only declare their columns and action buttons, so layout,
 * empty states, and the action-cell pattern stay identical across tabs.
 */

function EntityTable({
  items,
  columns,
  emptyText,
  renderActions
}) {
  if (!items.length) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
      className: "cns-objects-empty",
      children: emptyText
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("table", {
    className: "widefat cns-objects-table",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("thead", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("tr", {
        children: [columns.map((col, i) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("th", {
          style: col.width ? {
            width: col.width
          } : undefined,
          children: col.header
        }, i)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("th", {
          children: "Actions"
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("tbody", {
      children: items.map(item => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("tr", {
        children: [columns.map((col, i) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("td", {
          className: col.className,
          children: col.render(item)
        }, i)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("td", {
          className: "cns-maps-actions",
          children: renderActions(item)
        })]
      }, item.id))
    })]
  });
}

/***/ },

/***/ "./src/admin/app/lists/HierarchyRegionList.tsx"
/*!*****************************************************!*\
  !*** ./src/admin/app/lists/HierarchyRegionList.tsx ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HierarchyRegionList)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

function HierarchyRegionList({
  regions,
  onSelect,
  onDelete
}) {
  if (!regions.length) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
      className: "description",
      children: "No child-map regions yet. Click \"Add Region\" to draw one."
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("ul", {
    className: "cns-items-list",
    children: regions.map(r => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
      className: "cns-items-list__item",
      children: [r.child_map_thumbnail && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("img", {
        src: r.child_map_thumbnail,
        alt: "",
        className: "cns-items-list__thumb"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
        className: "cns-items-list__label",
        children: [r.child_map_title || `Map #${r.child_map_id}`, r.child_map_status && r.child_map_status !== 'publish' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("em", {
          className: "cns-items-list__status",
          children: [" \u2014 ", r.child_map_status]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
        className: "cns-items-list__actions",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
          type: "button",
          className: "button button-small",
          onClick: () => onSelect(r.id),
          children: "Edit"
        }), ' ', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
          type: "button",
          className: "button button-small",
          onClick: () => onDelete(r.id),
          children: "Delete"
        })]
      })]
    }, r.id))
  });
}

/***/ },

/***/ "./src/admin/app/lists/LabelsList.tsx"
/*!********************************************!*\
  !*** ./src/admin/app/lists/LabelsList.tsx ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LabelsList)
/* harmony export */ });
/* harmony import */ var _EntityTable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EntityTable */ "./src/admin/app/lists/EntityTable.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


const COLUMNS = [{
  header: '',
  width: 36,
  className: 'col-icon',
  render: label => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
    className: "cns-obj-dot",
    style: {
      background: label.canvas_styles?.bgColor || '#ffffff',
      border: `2px solid ${label.canvas_styles?.borderColor || '#1e1e1e'}`,
      borderRadius: 3
    }
  })
}, {
  header: 'Text',
  render: label => label.text || '(empty label)'
}, {
  header: 'Placement',
  render: label => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
    className: "cns-badge cns-badge--type",
    children: label.placement === 'indicator' ? 'Indicator' : 'Centered'
  })
}, {
  header: 'Position',
  render: label => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
    children: [label.x, ", ", label.y]
  })
}];
function LabelsList({
  labels,
  onEdit,
  onDuplicate,
  onDelete
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_EntityTable__WEBPACK_IMPORTED_MODULE_0__["default"], {
    items: labels,
    columns: COLUMNS,
    emptyText: "No labels yet. Click on the canvas to place one.",
    renderActions: label => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
        className: "button button-small",
        onClick: () => onEdit(label),
        children: "Edit"
      }), ' ', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
        className: "button button-small",
        onClick: () => onDuplicate(label.id),
        children: "Duplicate"
      }), ' ', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
        className: "button button-small",
        onClick: () => onDelete(label.id),
        children: "Delete"
      })]
    })
  });
}

/***/ },

/***/ "./src/admin/app/lists/ObjectsList.tsx"
/*!*********************************************!*\
  !*** ./src/admin/app/lists/ObjectsList.tsx ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ObjectsList)
/* harmony export */ });
/* harmony import */ var _EntityTable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EntityTable */ "./src/admin/app/lists/EntityTable.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


const COLUMNS = [{
  header: '',
  width: 36,
  className: 'col-icon',
  render: obj => obj.icon_url ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("img", {
    src: obj.icon_url,
    width: "28",
    height: "28",
    alt: "",
    style: {
      display: 'block',
      objectFit: 'contain'
    }
  }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
    className: "cns-obj-dot",
    style: {
      background: obj.canvas_styles?.fillStyle || '#2271b1'
    }
  })
}, {
  header: 'Title',
  render: obj => obj.title || '(no title)'
}, {
  header: 'Type',
  render: obj => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
    className: "cns-badge cns-badge--type",
    children: obj.type
  })
}, {
  header: 'Position',
  render: obj => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
    children: [obj.x, ", ", obj.y]
  })
}];
function ObjectsList({
  objects,
  onEdit,
  onDuplicate,
  onDelete
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_EntityTable__WEBPACK_IMPORTED_MODULE_0__["default"], {
    items: objects,
    columns: COLUMNS,
    emptyText: "No objects yet. Click on the canvas to place one.",
    renderActions: obj => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
        className: "button button-small",
        onClick: () => onEdit(obj),
        children: "Edit"
      }), ' ', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
        className: "button button-small",
        onClick: () => onDuplicate(obj.id),
        children: "Duplicate"
      }), ' ', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
        className: "button button-small",
        onClick: () => onDelete(obj.id),
        children: "Delete"
      })]
    })
  });
}

/***/ },

/***/ "./src/admin/app/panels/AreasPanel.tsx"
/*!*********************************************!*\
  !*** ./src/admin/app/panels/AreasPanel.tsx ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AreasPanel)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _canvases_AreasCanvas__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../canvases/AreasCanvas */ "./src/admin/app/canvases/AreasCanvas.tsx");
/* harmony import */ var _lists_AreasList__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lists/AreasList */ "./src/admin/app/lists/AreasList.tsx");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../utils */ "./src/admin/utils.ts");
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../canvas */ "./src/admin/canvas.ts");
/* harmony import */ var _areas__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../areas */ "./src/admin/areas.ts");
/* harmony import */ var _forms_AreaForm__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../forms/AreaForm */ "./src/admin/app/forms/AreaForm.tsx");
/* harmony import */ var _useCanvasKeyboard__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../useCanvasKeyboard */ "./src/admin/app/useCanvasKeyboard.ts");
/* harmony import */ var _useMapResource__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../useMapResource */ "./src/admin/app/useMapResource.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__);











// Internal clipboard for ⌘/Ctrl+C/V. Module scope so it survives tab
// switches within the editor page (not across page loads / other maps).
let areaClipboard = null;
function AreasPanel({
  mapId,
  settings,
  areas,
  selectedAreaId,
  onAreasLoaded,
  onSelect,
  onDeselect,
  onNodesUpdate,
  onDuplicate,
  onDelete
}) {
  (0,_useMapResource__WEBPACK_IMPORTED_MODULE_9__.useMapResource)(mapId, 'areas', onAreasLoaded);

  // ── Keyboard shortcuts (active while the Areas tab is mounted) ─────────────

  const selectedArea = areas.find(a => a.id === selectedAreaId) || null;
  const canvasW = settings.width || 1000;
  const canvasH = canvasW / (settings.aspectRatio || 1);

  // Keyboard-focused node of the selected area (Tab cycles it): arrows then
  // nudge that node instead of the whole area, Delete removes it, Esc clears
  // the focus (handled in the canvas, before deselecting).
  const [focusedNodeIdx, setFocusedNodeIdx] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setFocusedNodeIdx(null);
  }, [selectedAreaId]);

  // Node-list edits can shrink the node set — keep the focus index valid.
  const nodeCount = selectedArea ? (selectedArea.nodes || []).length : 0;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (focusedNodeIdx !== null && focusedNodeIdx >= nodeCount) {
      setFocusedNodeIdx(nodeCount ? nodeCount - 1 : null);
    }
  }, [nodeCount]);
  async function pasteArea() {
    if (!areaClipboard) return;
    // Cascade repeated pastes instead of stacking copies exactly on top
    // of each other (nodes are normalized 0–1, so shift by 24 px worth).
    const nodes = areaClipboard.nodes.map(n => ({
      ...n,
      x: n.x + 24 / canvasW,
      y: n.y + 24 / canvasH
    }));
    areaClipboard = {
      ...areaClipboard,
      nodes
    };
    const res = await (0,_utils__WEBPACK_IMPORTED_MODULE_4__.apiFetch)('POST', `/maps/${mapId}/areas`, {
      ...areaClipboard.form,
      nodes: JSON.stringify(nodes)
    });
    const data = await res.json();
    if (!res.ok) return;
    onAreasLoaded([...areas, data]);
    onSelect(data.id);
  }
  (0,_useCanvasKeyboard__WEBPACK_IMPORTED_MODULE_8__.useCanvasKeyboard)({
    copy: () => {
      if (!selectedArea) return false;
      areaClipboard = {
        form: (0,_forms_AreaForm__WEBPACK_IMPORTED_MODULE_7__.defaultAreaFormData)(selectedArea),
        nodes: (selectedArea.nodes || []).map(n => ({
          ...n
        }))
      };
      return true;
    },
    paste: () => {
      if (!areaClipboard) return false;
      void pasteArea();
      return true;
    },
    duplicate: () => {
      if (!selectedArea) return false;
      void onDuplicate(selectedArea.id);
      return true;
    },
    // With a node focused, Delete removes that node (where the shape
    // allows); otherwise it deletes the whole area after a confirm.
    remove: () => {
      if (!selectedArea) return false;
      if (focusedNodeIdx !== null) {
        if ((0,_areas__WEBPACK_IMPORTED_MODULE_6__.canRemoveAreaNode)(selectedArea)) {
          const nodes = (selectedArea.nodes || []).filter((_, i) => i !== focusedNodeIdx);
          onNodesUpdate(selectedArea.id, nodes);
          // The clamp effect keeps the index valid; move focus to
          // the previous node so repeated Deletes walk backwards.
          setFocusedNodeIdx(focusedNodeIdx > 0 ? focusedNodeIdx - 1 : 0);
        }
        return true; // claim the key even when the shape can't shrink
      }
      if (confirm((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Delete this area?', 'cns-map-suite'))) void onDelete(selectedArea.id);
      return true;
    },
    // Arrow keys nudge the focused node, or move the whole area when no
    // node is focused. Local update + persistence ride on the debounced
    // geometry save in MapEditorApp.
    nudge: (dx, dy) => {
      if (!selectedArea) return false;
      if (focusedNodeIdx !== null && (selectedArea.nodes || [])[focusedNodeIdx]) {
        const node = selectedArea.nodes[focusedNodeIdx];
        const newX = Math.min(1, Math.max(0, node.x + dx / canvasW));
        const newY = Math.min(1, Math.max(0, node.y + dy / canvasH));
        onNodesUpdate(selectedArea.id, (0,_areas__WEBPACK_IMPORTED_MODULE_6__.moveAreaNode)(selectedArea, focusedNodeIdx, newX, newY));
        return true;
      }
      const nodes = (selectedArea.nodes || []).map(n => ({
        ...n,
        x: n.x + dx / canvasW,
        y: n.y + dy / canvasH
      }));
      onNodesUpdate(selectedArea.id, nodes);
      return true;
    },
    // Tab / Shift+Tab cycle through the selected area's nodes.
    tab: backwards => {
      if (!selectedArea || !nodeCount) return false;
      setFocusedNodeIdx(prev => {
        if (prev === null) return backwards ? nodeCount - 1 : 0;
        return (prev + (backwards ? -1 : 1) + nodeCount) % nodeCount;
      });
      return true;
    }
  });
  async function handleAddArea() {
    if (!mapId) return;
    const defaultNodes = (0,_areas__WEBPACK_IMPORTED_MODULE_6__.getDefaultNodes)('POLYGON');
    try {
      const res = await (0,_utils__WEBPACK_IMPORTED_MODULE_4__.apiFetch)('POST', `/maps/${mapId}/areas`, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('New Area', 'cns-map-suite'),
        nodes: JSON.stringify(defaultNodes),
        style_fill: '#2271b1',
        style_fill_opacity: 0.3,
        style_stroke: '#2271b1',
        style_stroke_width: 2
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Failed to create area.', 'cns-map-suite'));
      onAreasLoaded([...areas, data]);
      onSelect(data.id);
    } catch (err) {
      alert(err.message);
    }
  }
  async function handleDelete(id) {
    if (!confirm('Delete this area?')) return;
    await onDelete(id);
  }
  const drawState = (0,_canvas__WEBPACK_IMPORTED_MODULE_5__.settingsToDrawState)(settings);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
    className: "cns-tab-panel cns-tab-panel--active",
    "data-panel": "areas",
    role: "tabpanel",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
      className: "cns-objects-layout",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
        className: "cns-objects-toolbar",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("button", {
          type: "button",
          className: "button button-primary",
          onClick: handleAddArea,
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Add Area', 'cns-map-suite')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("p", {
          className: "description",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Click a node to pick it up — it follows the cursor; click or press Enter to drop (Esc cancels). Click empty space on a selected area to add a node. With an area selected: arrow keys move the whole area (Shift = 10 px), Tab/Shift+Tab cycles its nodes — arrows then nudge that node and Delete removes it (Esc clears) — Ctrl/⌘+C & V copy & paste, Ctrl/⌘+D duplicates, Delete removes the area.', 'cns-map-suite')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_canvases_AreasCanvas__WEBPACK_IMPORTED_MODULE_2__["default"], {
        drawState: drawState,
        areas: areas,
        selectedAreaId: selectedAreaId,
        focusedNodeIdx: focusedNodeIdx,
        onSelect: onSelect,
        onDeselect: onDeselect,
        onNodesChange: onNodesUpdate,
        onNodeFocusChange: setFocusedNodeIdx
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_lists_AreasList__WEBPACK_IMPORTED_MODULE_3__["default"], {
        areas: areas,
        onSelect: onSelect,
        onDuplicate: id => void onDuplicate(id),
        onDelete: handleDelete
      })]
    })
  });
}

/***/ },

/***/ "./src/admin/app/panels/DescriptionPanel.tsx"
/*!***************************************************!*\
  !*** ./src/admin/app/panels/DescriptionPanel.tsx ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DescriptionPanel)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



const EDITOR_ID = 'cns-map-description';
/**
 * Rich-text map description, edited with the classic (TinyMCE) editor —
 * wp_enqueue_editor() provides it on the map editor page. The textarea is
 * uncontrolled: TinyMCE owns the DOM, and edits stream back into the map
 * settings state via editor events (Visual) / the input event (Text mode).
 * The panel unmounts on tab switch, so the instance is torn down and
 * re-initialized with the latest value each time the tab opens.
 */
function DescriptionPanel({
  value,
  onChange
}) {
  const onChangeRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(onChange);
  onChangeRef.current = onChange;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const ed = window.wp?.oldEditor || window.wp?.editor;
    const textarea = document.getElementById(EDITOR_ID);

    // Text-mode (Quicktags) edits land directly in the textarea.
    const onInput = () => onChangeRef.current(textarea?.value ?? '');
    textarea?.addEventListener('input', onInput);
    if (ed?.initialize) {
      ed.initialize(EDITOR_ID, {
        tinymce: {
          wpautop: true,
          height: 320,
          toolbar1: 'formatselect,bold,italic,bullist,numlist,blockquote,hr,alignleft,aligncenter,alignright,link,unlink,undo,redo',
          setup(editor) {
            // No SetContent here — it fires during init and would
            // mark the settings dirty before any user edit.
            editor.on('change keyup input Undo Redo', () => {
              onChangeRef.current(editor.getContent());
            });
          }
        },
        quicktags: true,
        mediaButtons: true
      });
    }
    return () => {
      textarea?.removeEventListener('input', onInput);
      ed?.remove?.(EDITOR_ID);
    };
  }, []);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
    className: "cns-tab-panel cns-tab-panel--active",
    "data-panel": "description",
    role: "tabpanel",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "cns-desc-editor",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
        className: "description",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Shown beneath the map on its own page and wherever the map block is embedded. Not shown where the map is only used as a base (e.g. stories, master-map regions).', 'cns-map-suite')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("textarea", {
        id: EDITOR_ID,
        rows: 14,
        defaultValue: value
      })]
    })
  });
}

/***/ },

/***/ "./src/admin/app/panels/HierarchyPanel.tsx"
/*!*************************************************!*\
  !*** ./src/admin/app/panels/HierarchyPanel.tsx ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HierarchyPanel)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _canvases_HierarchyCanvas__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../canvases/HierarchyCanvas */ "./src/admin/app/canvases/HierarchyCanvas.tsx");
/* harmony import */ var _lists_HierarchyRegionList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lists/HierarchyRegionList */ "./src/admin/app/lists/HierarchyRegionList.tsx");
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../canvas */ "./src/admin/canvas.ts");
/* harmony import */ var _areas__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../areas */ "./src/admin/areas.ts");
/* harmony import */ var _useMapResource__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../useMapResource */ "./src/admin/app/useMapResource.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);







function HierarchyPanel({
  mapId,
  settings,
  regions,
  selectedRegionId,
  parentMaps,
  onRegionsLoaded,
  onSelect,
  onDeselect,
  onNodesUpdate,
  onDelete
}) {
  (0,_useMapResource__WEBPACK_IMPORTED_MODULE_5__.useMapResource)(mapId, 'hierarchy', onRegionsLoaded);
  async function handleAddRegion() {
    if (!mapId) return;
    // Create a placeholder region with no child yet; user assigns it in the context panel.
    // We use child_map_id=0 as a sentinel and immediately select it.
    // The REST API requires a valid child_map_id, so we create with the map's own ID as
    // a placeholder — but the API rejects self-links. Instead, just insert an empty polygon
    // that the user fills in via the context form.
    //
    // Strategy: optimistically add a local-only "draft" region, select it for editing.
    // It won't be persisted until the user saves from the context panel (which requires
    // a valid child_map_id). We mark it with id=-1 as an unsaved sentinel.
    const draft = {
      id: -1,
      parent_map_id: mapId,
      child_map_id: 0,
      nodes: (0,_areas__WEBPACK_IMPORTED_MODULE_4__.getDefaultNodes)('POLYGON'),
      canvas_styles: {
        fill: '#e8a020',
        fillOpacity: 0.25,
        stroke: '#e8a020',
        strokeWidth: 2
      },
      title_override: null,
      description_override: null,
      child_map_title: '',
      child_map_excerpt: '',
      child_map_status: '',
      child_map_thumbnail: '',
      child_map_url: '',
      created_at: '',
      updated_at: ''
    };
    onRegionsLoaded([...regions, draft]);
    onSelect(-1);
  }
  async function handleDelete(id) {
    if (id === -1) {
      // Unsaved draft — just remove locally.
      onRegionsLoaded(regions.filter(r => r.id !== -1));
      onDeselect();
      return;
    }
    if (!confirm((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Delete this hierarchy region?', 'cns-map-suite'))) return;
    await onDelete(id);
  }
  const drawState = (0,_canvas__WEBPACK_IMPORTED_MODULE_3__.settingsToDrawState)(settings);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
    className: "cns-tab-panel cns-tab-panel--active",
    "data-panel": "hierarchy",
    role: "tabpanel",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      className: "cns-objects-layout",
      children: [parentMaps.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "cns-hierarchy-parents",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
          className: "cns-hierarchy-parents__label",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Parent maps:', 'cns-map-suite')
        }), parentMaps.map(p => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("a", {
          href: p.url,
          className: "cns-hierarchy-parents__link",
          children: [p.thumbnail && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("img", {
            src: p.thumbnail,
            alt: ""
          }), p.title]
        }, p.map_id))]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "cns-objects-toolbar",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("button", {
          type: "button",
          className: "button button-primary",
          onClick: handleAddRegion,
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add Region', 'cns-map-suite')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
          className: "description",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Draw a polygon region that links to a child map. Click a node to reposition it; click empty canvas on a selected region to add a node.', 'cns-map-suite')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_canvases_HierarchyCanvas__WEBPACK_IMPORTED_MODULE_1__["default"], {
        drawState: drawState,
        regions: regions,
        selectedRegionId: selectedRegionId,
        onSelect: onSelect,
        onDeselect: onDeselect,
        onNodesChange: onNodesUpdate
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_lists_HierarchyRegionList__WEBPACK_IMPORTED_MODULE_2__["default"], {
        regions: regions.filter(r => r.id !== -1),
        onSelect: onSelect,
        onDelete: handleDelete
      })]
    })
  });
}

/***/ },

/***/ "./src/admin/app/panels/LabelsPanel.tsx"
/*!**********************************************!*\
  !*** ./src/admin/app/panels/LabelsPanel.tsx ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LabelsPanel)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _canvases_LabelsCanvas__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../canvases/LabelsCanvas */ "./src/admin/app/canvases/LabelsCanvas.tsx");
/* harmony import */ var _lists_LabelsList__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lists/LabelsList */ "./src/admin/app/lists/LabelsList.tsx");
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../canvas */ "./src/admin/canvas.ts");
/* harmony import */ var _forms_LabelForm__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../forms/LabelForm */ "./src/admin/app/forms/LabelForm.tsx");
/* harmony import */ var _useCanvasKeyboard__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../useCanvasKeyboard */ "./src/admin/app/useCanvasKeyboard.ts");
/* harmony import */ var _useMapResource__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../useMapResource */ "./src/admin/app/useMapResource.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__);









// Internal clipboard for ⌘/Ctrl+C/V. Module scope so it survives tab
// switches within the editor page (not across page loads / other maps).
let labelClipboard = null;
function LabelsPanel({
  mapId,
  settings,
  labels,
  selectedLabelId,
  repositioningLabelId,
  onLabelsLoaded,
  onSelect,
  onDeselect,
  onAdd,
  onGeometryUpdate,
  onLocalUpdate,
  onDuplicate,
  onRepositionComplete,
  onDelete
}) {
  (0,_useMapResource__WEBPACK_IMPORTED_MODULE_7__.useMapResource)(mapId, 'labels', onLabelsLoaded);

  // The nudge factory is created once; these refs feed it live values.
  const stateRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    labels,
    selectedLabelId
  });
  stateRef.current = {
    labels,
    selectedLabelId
  };
  const propsRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    onGeometryUpdate,
    onLocalUpdate
  });
  propsRef.current = {
    onGeometryUpdate,
    onLocalUpdate
  };

  // ── Keyboard shortcuts (active while the Labels tab is mounted) ────────────

  const selectedLabel = labels.find(l => l.id === selectedLabelId) || null;
  const nudger = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)((0,_useCanvasKeyboard__WEBPACK_IMPORTED_MODULE_6__.createDebouncedNudge)(() => {
    const s = stateRef.current;
    return s.labels.find(l => l.id === s.selectedLabelId) || null;
  }, (id, x, y) => propsRef.current.onLocalUpdate(id, {
    x,
    y
  }), (id, x, y) => void propsRef.current.onGeometryUpdate(id, {
    x,
    y
  })));
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => () => nudger.current.flush(), []); // persist pending nudge on tab leave

  async function pasteLabel() {
    if (!labelClipboard) return;
    // Cascade repeated pastes instead of stacking copies exactly on top
    // of each other.
    const payload = {
      ...labelClipboard,
      x: labelClipboard.x + 24,
      y: labelClipboard.y + 24
    };
    labelClipboard = payload;
    const created = await onAdd(payload);
    onSelect(created.id);
  }
  (0,_useCanvasKeyboard__WEBPACK_IMPORTED_MODULE_6__.useCanvasKeyboard)({
    copy: () => {
      if (!selectedLabel) return false;
      labelClipboard = (0,_forms_LabelForm__WEBPACK_IMPORTED_MODULE_5__.collectLabelPayload)((0,_forms_LabelForm__WEBPACK_IMPORTED_MODULE_5__.defaultLabelFormData)(selectedLabel, null, null));
      return true;
    },
    paste: () => {
      if (!labelClipboard) return false;
      void pasteLabel();
      return true;
    },
    duplicate: () => {
      if (!selectedLabel) return false;
      void onDuplicate(selectedLabel.id);
      return true;
    },
    remove: () => {
      if (!selectedLabel) return false;
      if (confirm((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Delete this label?', 'cns-map-suite'))) void onDelete(selectedLabel.id);
      return true;
    },
    nudge: (dx, dy) => nudger.current.nudge(dx, dy)
  });
  async function handleAdd() {
    const cx = Math.round(settings.width / 2);
    const cy = Math.round(settings.width / settings.aspectRatio / 2);
    const payload = (0,_forms_LabelForm__WEBPACK_IMPORTED_MODULE_5__.collectLabelPayload)({
      ...(0,_forms_LabelForm__WEBPACK_IMPORTED_MODULE_5__.defaultLabelFormData)(null, cx, cy),
      text: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('New Label', 'cns-map-suite')
    });
    const created = await onAdd(payload);
    onSelect(created.id);
  }
  async function handleDelete(id) {
    if (!confirm((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Delete this label?', 'cns-map-suite'))) return;
    await onDelete(id);
  }
  const drawState = (0,_canvas__WEBPACK_IMPORTED_MODULE_4__.settingsToDrawState)(settings);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
    className: "cns-tab-panel cns-tab-panel--active",
    "data-panel": "labels",
    role: "tabpanel",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
      className: "cns-objects-layout",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
        className: "cns-objects-toolbar",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("button", {
          type: "button",
          className: "button button-primary",
          onClick: handleAdd,
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Add Label', 'cns-map-suite')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("p", {
          className: "description",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Click a label to pick it up — it follows the cursor; click or press Enter to drop (Esc cancels). In indicator mode the dot and the text box move independently. With a label selected: Enter picks it up, arrow keys nudge (Shift = 10 px), Ctrl/⌘+C & V copy & paste, Ctrl/⌘+D duplicates, Delete removes.', 'cns-map-suite')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_canvases_LabelsCanvas__WEBPACK_IMPORTED_MODULE_2__["default"], {
        drawState: drawState,
        labels: labels,
        selectedLabelId: selectedLabelId,
        repositioningLabelId: repositioningLabelId,
        onSelect: onSelect,
        onDeselect: onDeselect,
        onGeometryUpdate: onGeometryUpdate,
        onRepositionComplete: onRepositionComplete
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_lists_LabelsList__WEBPACK_IMPORTED_MODULE_3__["default"], {
        labels: labels,
        onEdit: label => onSelect(label.id),
        onDuplicate: id => void onDuplicate(id),
        onDelete: handleDelete
      })]
    })
  });
}

/***/ },

/***/ "./src/admin/app/panels/ObjectsPanel.tsx"
/*!***********************************************!*\
  !*** ./src/admin/app/panels/ObjectsPanel.tsx ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ObjectsPanel)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _canvases_ObjectsCanvas__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../canvases/ObjectsCanvas */ "./src/admin/app/canvases/ObjectsCanvas.tsx");
/* harmony import */ var _lists_ObjectsList__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lists/ObjectsList */ "./src/admin/app/lists/ObjectsList.tsx");
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../canvas */ "./src/admin/canvas.ts");
/* harmony import */ var _forms_ObjectForm__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../forms/ObjectForm */ "./src/admin/app/forms/ObjectForm.tsx");
/* harmony import */ var _useCanvasKeyboard__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../useCanvasKeyboard */ "./src/admin/app/useCanvasKeyboard.ts");
/* harmony import */ var _useMapResource__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../useMapResource */ "./src/admin/app/useMapResource.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__);









// Internal clipboard for ⌘/Ctrl+C/V. Module scope so it survives tab
// switches within the editor page (not across page loads / other maps).
let objectClipboard = null;
function ObjectsPanel({
  mapId,
  settings,
  objects,
  selectedObjectId,
  repositioningObjectId,
  onObjectsLoaded,
  onSelect,
  onDeselect,
  onAdd,
  onPositionUpdate,
  onLocalUpdate,
  onDuplicate,
  onRepositionStart,
  onRepositionComplete,
  onDelete
}) {
  (0,_useMapResource__WEBPACK_IMPORTED_MODULE_7__.useMapResource)(mapId, 'objects', onObjectsLoaded);

  // The nudge factory is created once; these refs feed it live values.
  const stateRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    objects,
    selectedObjectId
  });
  stateRef.current = {
    objects,
    selectedObjectId
  };
  const propsRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    onPositionUpdate,
    onLocalUpdate
  });
  propsRef.current = {
    onPositionUpdate,
    onLocalUpdate
  };

  // ── Keyboard shortcuts (active while the Objects tab is mounted) ───────────

  const selectedObject = objects.find(o => o.id === selectedObjectId) || null;
  const nudger = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)((0,_useCanvasKeyboard__WEBPACK_IMPORTED_MODULE_6__.createDebouncedNudge)(() => {
    const s = stateRef.current;
    return s.objects.find(o => o.id === s.selectedObjectId) || null;
  }, (id, x, y) => propsRef.current.onLocalUpdate(id, {
    x,
    y
  }), (id, x, y) => void propsRef.current.onPositionUpdate(id, x, y)));
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => () => nudger.current.flush(), []); // persist pending nudge on tab leave

  async function pasteObject() {
    if (!objectClipboard) return;
    // Cascade repeated pastes instead of stacking copies exactly on top
    // of each other.
    const payload = {
      ...objectClipboard,
      x: objectClipboard.x + 24,
      y: objectClipboard.y + 24
    };
    objectClipboard = payload;
    const created = await onAdd(payload);
    onSelect(created.id);
  }
  (0,_useCanvasKeyboard__WEBPACK_IMPORTED_MODULE_6__.useCanvasKeyboard)({
    copy: () => {
      if (!selectedObject) return false;
      objectClipboard = (0,_forms_ObjectForm__WEBPACK_IMPORTED_MODULE_5__.collectObjectPayload)((0,_forms_ObjectForm__WEBPACK_IMPORTED_MODULE_5__.defaultObjectFormData)(selectedObject, null, null));
      return true;
    },
    paste: () => {
      if (!objectClipboard) return false;
      void pasteObject();
      return true;
    },
    duplicate: () => {
      if (!selectedObject) return false;
      void onDuplicate(selectedObject.id);
      return true;
    },
    remove: () => {
      if (!selectedObject) return false;
      if (confirm((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Delete this object?', 'cns-map-suite'))) void onDelete(selectedObject.id);
      return true;
    },
    nudge: (dx, dy) => nudger.current.nudge(dx, dy)
  });

  // New objects are created immediately and edited in the context panel —
  // same flow as areas and labels (the modal is gone).
  async function handleCreateAt(x, y) {
    const payload = (0,_forms_ObjectForm__WEBPACK_IMPORTED_MODULE_5__.collectObjectPayload)({
      ...(0,_forms_ObjectForm__WEBPACK_IMPORTED_MODULE_5__.defaultObjectFormData)(null, x, y),
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('New Object', 'cns-map-suite')
    });
    const created = await onAdd(payload);
    onSelect(created.id);
  }
  function handleAdd() {
    const cx = Math.round(settings.width / 2);
    const cy = Math.round(settings.width / settings.aspectRatio / 2);
    void handleCreateAt(cx, cy);
  }
  async function handleDelete(id) {
    if (!confirm((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Delete this object?', 'cns-map-suite'))) return;
    await onDelete(id);
  }
  const drawState = (0,_canvas__WEBPACK_IMPORTED_MODULE_4__.settingsToDrawState)(settings);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
    className: "cns-tab-panel cns-tab-panel--active",
    "data-panel": "objects",
    role: "tabpanel",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
      className: "cns-objects-layout",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
        className: "cns-objects-toolbar",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("button", {
          type: "button",
          className: "button button-primary",
          onClick: handleAdd,
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Add Object', 'cns-map-suite')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("p", {
          className: "description",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Click an object to pick it up — it follows the cursor; click or press Enter to drop (Esc cancels). Click empty canvas to place a new object at that position, then edit it in the side panel. With an object selected: Enter picks it up, arrow keys nudge (Shift = 10 px), Ctrl/⌘+C & V copy & paste, Ctrl/⌘+D duplicates, Delete removes.', 'cns-map-suite')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_canvases_ObjectsCanvas__WEBPACK_IMPORTED_MODULE_2__["default"], {
        drawState: drawState,
        objects: objects,
        selectedObjectId: selectedObjectId,
        repositioningObjectId: repositioningObjectId,
        onSelect: onSelect,
        onDeselect: onDeselect,
        onPositionUpdate: onPositionUpdate,
        onRepositionComplete: onRepositionComplete,
        onPlace: (x, y) => void handleCreateAt(x, y)
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_lists_ObjectsList__WEBPACK_IMPORTED_MODULE_3__["default"], {
        objects: objects,
        onEdit: obj => onSelect(obj.id),
        onDuplicate: id => void onDuplicate(id),
        onDelete: handleDelete
      })]
    })
  });
}

/***/ },

/***/ "./src/admin/app/panels/PreviewPanel.tsx"
/*!***********************************************!*\
  !*** ./src/admin/app/panels/PreviewPanel.tsx ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PreviewPanel)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _canvases_PreviewCanvas__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../canvases/PreviewCanvas */ "./src/admin/app/canvases/PreviewCanvas.tsx");
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../canvas */ "./src/admin/canvas.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




function PreviewPanel({
  settings,
  objects,
  areas,
  labels,
  viewUrl
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: "cns-tab-panel cns-tab-panel--active",
    "data-panel": "preview",
    role: "tabpanel",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_canvases_PreviewCanvas__WEBPACK_IMPORTED_MODULE_1__["default"], {
      drawState: (0,_canvas__WEBPACK_IMPORTED_MODULE_2__.settingsToDrawState)(settings),
      objects: objects,
      areas: areas,
      labels: labels
    }), settings.description.trim() !== '' &&
    /*#__PURE__*/
    // Mirrors the frontend: description renders beneath the map.
    // Own admin input; the server sanitizes it (wp_kses_post) on save.
    (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "cns-map-description cns-map-description--preview",
      dangerouslySetInnerHTML: {
        __html: settings.description
      }
    }), viewUrl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "cns-preview-actions",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("a", {
        href: viewUrl,
        className: "button",
        target: "_blank",
        rel: "noopener noreferrer",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('View map page', 'cns-map-suite')
      })
    })]
  });
}

/***/ },

/***/ "./src/admin/app/panels/SettingsPanel.tsx"
/*!************************************************!*\
  !*** ./src/admin/app/panels/SettingsPanel.tsx ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SettingsPanel)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/chevron-left-small.mjs");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/chevron-right-small.mjs");
/* harmony import */ var _shared_MediaPicker__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../shared/MediaPicker */ "./src/admin/app/shared/MediaPicker.tsx");
/* harmony import */ var _canvases_SettingsCanvas__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../canvases/SettingsCanvas */ "./src/admin/app/canvases/SettingsCanvas.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);




// Custom elements



function SettingsPanel({
  settings,
  onChange
}) {
  function set(key, val) {
    onChange(prev => ({
      ...prev,
      [key]: val
    }));
  }
  function openThumbnailPicker() {
    const frame = window.wp?.media?.({
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select Map Thumbnail', 'cns-map-suite'),
      button: {
        text: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Use as thumbnail', 'cns-map-suite')
      },
      multiple: false,
      library: {
        type: 'image'
      }
    });
    if (!frame) return;
    frame.on('select', () => {
      const att = frame.state().get('selection').first().toJSON();
      onChange(prev => ({
        ...prev,
        thumbnailId: att.id,
        thumbnailUrl: att.url
      }));
    });
    frame.open();
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
    className: "cns-tab-panel cns-tab-panel--active",
    "data-panel": "settings",
    role: "tabpanel",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      className: "cns-settings-layout",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
        className: "cns-settings-form",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
          className: "cns-grid cns-grid__24",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
            className: "cns-grid__group cns-grid__group-input cns-grid__span-3",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
              __next40pxDefaultSize: true,
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Map Title', 'cns-map-suite'),
              value: settings.title,
              placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Enter map title…', 'cns-map-suite'),
              onChange: title => set('title', title)
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
            className: "cns-grid__group cns-grid__group-input cns-grid__span-1",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalNumberControl, {
              __next40pxDefaultSize: true,
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Map Time', 'cns-map-suite'),
              value: settings.time,
              step: 1,
              spinControls: "native",
              isDragEnabled: true,
              isShiftStepEnabled: true,
              shiftStep: 10,
              onChange: value => set('time', parseInt(value ?? '', 10) || 0),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('In-world timeline value.', 'cns-map-suite')
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
            className: "cns-grid__group cns-grid__group-input cns-grid__span-3",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
              __next40pxDefaultSize: true,
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Aspect Ratio', 'cns-map-suite'),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Width ÷ Height (1.77 = 16:9, 1.0 = square, 0.75 = portrait)', 'cns-map-suite'),
              beforeIcon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__["default"],
              afterIcon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_3__["default"],
              withInputField: true,
              separatorType: "none",
              trackColor: "green",
              isShiftStepEnabled: true,
              marks: [{
                value: 0,
                label: '0'
              }, {
                value: 1,
                label: '1'
              }, {
                value: 2,
                label: '2'
              }, {
                value: 3,
                label: '3'
              }, {
                value: 4,
                label: '4'
              }],
              railColor: "red",
              value: settings.aspectRatio,
              onChange: v => set('aspectRatio', v ?? 1),
              allowReset: true,
              resetFallbackValue: 1.0,
              min: 0.25,
              max: 4,
              step: 0.01
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
            className: "cns-grid__group cns-grid__group-input cns-grid__span-1",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
              __next40pxDefaultSize: true,
              type: "number",
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Max Width (px)', 'cns-map-suite'),
              min: 100,
              step: 10,
              value: settings.width,
              onChange: value => set('width', parseInt(value, 10) || 1000)
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
            className: "cns-grid__group  cns-grid__span-2",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_shared_MediaPicker__WEBPACK_IMPORTED_MODULE_4__["default"], {
              imageId: settings.imageId,
              imageUrl: settings.imageUrl,
              label: "Base Map Image2",
              title: "Select Base Map Image",
              onChange: att => onChange(prev => ({
                ...prev,
                imageId: att ? att.id : 0,
                imageUrl: att ? att.url : ''
              }))
            })
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_canvases_SettingsCanvas__WEBPACK_IMPORTED_MODULE_5__["default"], {
        settings: settings
      })]
    })
  });
}

/***/ },

/***/ "./src/admin/app/shared/IconPicker.tsx"
/*!*********************************************!*\
  !*** ./src/admin/app/shared/IconPicker.tsx ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ IconPicker)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

function IconPicker({
  icons,
  selectedIconId,
  onSelect
}) {
  if (!icons || !icons.length) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
      className: "description",
      children: ["No icons yet.", ' ', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("a", {
        href: window.cnsMapSuite.iconsUrl,
        target: "_blank",
        rel: "noreferrer",
        children: "Add icons \u2192"
      })]
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
    className: "cns-icon-picker-grid",
    children: icons.map(icon => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
      type: "button",
      className: `cns-icon-item${icon.id === selectedIconId ? ' cns-icon-item--active' : ''}`,
      title: icon.title,
      onClick: () => onSelect(icon.id),
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("img", {
        src: icon.url,
        alt: icon.title
      })
    }, icon.id))
  });
}

/***/ },

/***/ "./src/admin/app/shared/MediaPicker.tsx"
/*!**********************************************!*\
  !*** ./src/admin/app/shared/MediaPicker.tsx ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MediaPicker)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_media_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/media-utils */ "@wordpress/media-utils");
/* harmony import */ var _wordpress_media_utils__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_media_utils__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/image.mjs");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/pencil.mjs");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/trash.mjs");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);





// The published types for MediaUpload declare its props as an untyped class
// component, so we re-type the render-prop surface we actually use.

const Media = _wordpress_media_utils__WEBPACK_IMPORTED_MODULE_1__.MediaUpload;
function MediaPicker({
  imageId,
  imageUrl,
  title,
  label,
  onChange
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Card, {
    className: "cns-image-picker",
    children: [label && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.CardHeader, {
      children: [" ", label]
    }), imageUrl ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.CardMedia, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("img", {
        src: imageUrl,
        alt: ""
      })
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.CardBody, {
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('No image selected', 'cns-map-suite')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.CardFooter, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Flex, {
        gap: 2,
        align: "center",
        justify: "start",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.FlexBlock, {
          style: {
            width: 'fit-content',
            flex: 'unset'
          },
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(Media, {
            title: title,
            allowedTypes: ['image'],
            multiple: false,
            value: imageId,
            onSelect: att => onChange({
              id: att.id,
              url: att.url
            }),
            render: ({
              open
            }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
              variant: "secondary",
              icon: imageId > 0 ? _wordpress_icons__WEBPACK_IMPORTED_MODULE_3__["default"] : _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__["default"],
              label: imageId > 0 ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Replace image', 'cns-map-suite') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Select image', 'cns-map-suite'),
              onClick: open
            })
          })
        }), imageId > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.FlexBlock, {
          style: {
            width: 'fit-content',
            flex: 'unset'
          },
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
            variant: "tertiary",
            isDestructive: true,
            icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_4__["default"],
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Remove image', 'cns-map-suite'),
            onClick: () => onChange(null)
          })
        })]
      })
    })]
  });
}

/***/ },

/***/ "./src/admin/app/shared/PostSearch.tsx"
/*!*********************************************!*\
  !*** ./src/admin/app/shared/PostSearch.tsx ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PostSearch)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


function PostSearch({
  linkedPostId,
  linkedPostLabel,
  onChange
}) {
  const [query, setQuery] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [results, setResults] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [open, setOpen] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const timer = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  function handleInput(e) {
    const val = e.target.value;
    setQuery(val);
    if (timer.current) clearTimeout(timer.current);
    if (val.length < 2) {
      setOpen(false);
      return;
    }
    timer.current = setTimeout(async () => {
      try {
        const url = window.cnsMapSuite.wpRestUrl + '/search?search=' + encodeURIComponent(val) + '&type=post&subtype=any&per_page=10';
        const res = await fetch(url, {
          headers: {
            'X-WP-Nonce': window.cnsMapSuite.nonce
          }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setResults(data);
          setOpen(true);
        }
      } catch {/* silent */}
    }, 350);
  }
  function selectResult(item) {
    onChange?.({
      id: item.id,
      title: item.title
    });
    setQuery('');
    setResults([]);
    setOpen(false);
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: "cns-post-search-wrap",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("label", {
      children: "Search for a post"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
      type: "text",
      className: "large-text",
      placeholder: "Type to search\u2026",
      autoComplete: "off",
      value: query,
      onChange: handleInput
    }), open && results.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "cns-post-results",
      children: results.map(item => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("button", {
        type: "button",
        className: "cns-post-result",
        onClick: () => selectResult(item),
        children: [item.title, ' ', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
          className: "cns-post-result__type",
          children: item.subtype
        })]
      }, item.id))
    }), linkedPostId > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("p", {
      className: "description",
      children: [linkedPostLabel || `Post ID: ${linkedPostId}`, ' ', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
        type: "button",
        className: "button button-small",
        onClick: () => onChange?.({
          id: 0,
          title: ''
        }),
        children: "Clear"
      })]
    })]
  });
}

/***/ },

/***/ "./src/admin/app/shared/RangeField.tsx"
/*!*********************************************!*\
  !*** ./src/admin/app/shared/RangeField.tsx ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RangeField)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


/**
 * Slider + number-input pair — the one control used for every range value in
 * the editor. The number input keeps a local draft while typing so
 * intermediate states ("", "0.") don't snap back before they parse.
 */
function RangeField({
  id,
  min,
  max,
  step,
  value,
  onChange
}) {
  const [draft, setDraft] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const decimals = (String(step).split('.')[1] || '').length;
  const display = draft ?? String(Number(value.toFixed(decimals)));
  function commit(raw) {
    const parsed = parseFloat(raw);
    if (!Number.isNaN(parsed)) {
      onChange(Math.min(max, Math.max(min, parsed)));
    }
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: "cns-range-wrap",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
      id: id,
      type: "range",
      min: min,
      max: max,
      step: step,
      value: value,
      onChange: e => {
        setDraft(null);
        onChange(parseFloat(e.target.value));
      }
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
      type: "number",
      className: "small-text cns-range-number",
      min: min,
      max: max,
      step: step,
      value: display,
      "aria-label": "Exact value",
      onChange: e => {
        setDraft(e.target.value);
        commit(e.target.value);
      },
      onBlur: () => setDraft(null)
    })]
  });
}

/***/ },

/***/ "./src/admin/app/shared/SaveStatus.tsx"
/*!*********************************************!*\
  !*** ./src/admin/app/shared/SaveStatus.tsx ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SaveStatus)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

function SaveStatus({
  text,
  type
}) {
  if (!text) return null;
  const cls = 'cns-save-status' + (type ? ` cns-save-status--${type}` : '');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
    className: cls,
    children: text
  });
}

/***/ },

/***/ "./src/admin/app/useCanvasKeyboard.ts"
/*!********************************************!*\
  !*** ./src/admin/app/useCanvasKeyboard.ts ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createDebouncedNudge: () => (/* binding */ createDebouncedNudge),
/* harmony export */   useCanvasKeyboard: () => (/* binding */ useCanvasKeyboard)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/admin/utils.ts");



/**
 * Shared keyboard layer for the entity canvas tabs (objects / areas /
 * labels), modeled on the Labels tab behavior:
 *
 *   Ctrl/⌘+C / V      copy & paste (each panel keeps its own clipboard)
 *   Ctrl/⌘+D          duplicate the selected item
 *   Delete/Backspace  delete the selected item (panels confirm first)
 *   Arrow keys        nudge (Shift = 10 px)
 *   Tab / Shift+Tab   cycle sub-parts of the selection (e.g. area nodes);
 *                     falls through to normal focus traversal when unhandled
 *
 * Enter/Escape stay in the canvas components, where the drag state lives.
 *
 * The listener binds once per mount (panels unmount with their tab, which
 * scopes the shortcuts); handlers are read through a ref so they always see
 * the current render's props. Each handler returns true when it acted —
 * only then is the browser default suppressed, so e.g. arrow keys still
 * scroll the page while nothing is selected. Shortcuts never fire while
 * typing in a form field.
 */

const ARROWS = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0]
};
function useCanvasKeyboard(handlers) {
  const ref = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(handlers);
  ref.current = handlers;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    function onKeyDown(e) {
      if ((0,_utils__WEBPACK_IMPORTED_MODULE_1__.isTypingTarget)(e)) return;
      const h = ref.current;
      const mod = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();
      if (mod && key === 'c') {
        // Leave real text-selection copies alone.
        if (!window.getSelection()?.toString()) h.copy?.();
        return;
      }
      if (mod && key === 'v') {
        h.paste?.();
        return;
      }
      if (mod && key === 'd') {
        if (h.duplicate?.()) e.preventDefault(); // browser "bookmark page"
        return;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (h.remove?.()) e.preventDefault();
        return;
      }
      if (e.key === 'Tab' && !mod && !e.altKey) {
        if (h.tab?.(e.shiftKey)) e.preventDefault();
        return;
      }
      if (ARROWS[e.key] && h.nudge) {
        const step = e.shiftKey ? 10 : 1;
        if (h.nudge(ARROWS[e.key][0] * step, ARROWS[e.key][1] * step)) {
          e.preventDefault(); // page scroll
        }
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);
}

/**
 * Debounced arrow-key nudging for point-positioned entities (objects,
 * labels): the canvas updates immediately via applyLocal, and persist fires
 * once the keys go quiet so holding an arrow doesn't PATCH per pixel.
 * Create once per mount (closures must read live state, e.g. via refs) and
 * call flush() on unmount so a pending nudge isn't lost.
 */

function createDebouncedNudge(getSelected, applyLocal, persist, delay = 500) {
  let timer = null;
  let pending = null;
  function flush() {
    if (timer) {
      window.clearTimeout(timer);
      timer = null;
    }
    const p = pending;
    pending = null;
    if (p) persist(p.id, p.x, p.y);
  }
  function nudge(dx, dy) {
    const item = getSelected();
    if (!item) return false;
    // Switching selection mid-debounce: persist the previous item first.
    if (pending && pending.id !== item.id) flush();
    const base = pending ?? {
      id: item.id,
      x: item.x,
      y: item.y
    };
    const x = Math.max(0, base.x + dx);
    const y = Math.max(0, base.y + dy);
    pending = {
      id: item.id,
      x,
      y
    };
    applyLocal(item.id, x, y);
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(flush, delay);
    return true;
  }
  return {
    nudge,
    flush
  };
}

/***/ },

/***/ "./src/admin/app/useMapResource.ts"
/*!*****************************************!*\
  !*** ./src/admin/app/useMapResource.ts ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useMapResource: () => (/* binding */ useMapResource)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/admin/utils.ts");



/**
 * Loads a map-scoped REST collection (objects / areas / labels / hierarchy)
 * once per panel mount and hands the rows to the parent-owned list state.
 * Errors are swallowed — the panel simply starts empty, matching the
 * previous inline behavior in every panel.
 */
function useMapResource(mapId, resource, onLoaded) {
  const [initialized, setInitialized] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const onLoadedRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(onLoaded);
  onLoadedRef.current = onLoaded;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (initialized || !mapId) return;
    (0,_utils__WEBPACK_IMPORTED_MODULE_1__.apiFetch)('GET', `/maps/${mapId}/${resource}`).then(r => r.json()).then(data => {
      if (Array.isArray(data)) onLoadedRef.current(data);
    }).catch(() => {}).finally(() => setInitialized(true));
  }, [mapId]);
}

/***/ },

/***/ "./src/admin/areas.ts"
/*!****************************!*\
  !*** ./src/admin/areas.ts ***!
  \****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyRectangleConstraint: () => (/* binding */ applyRectangleConstraint),
/* harmony export */   canRemoveAreaNode: () => (/* binding */ canRemoveAreaNode),
/* harmony export */   drawAreaShape: () => (/* binding */ drawAreaShape),
/* harmony export */   drawAreasOnCanvas: () => (/* binding */ drawAreasOnCanvas),
/* harmony export */   findAreaAtPoint: () => (/* reexport safe */ _shared_map_geometry__WEBPACK_IMPORTED_MODULE_1__.findAreaAtPoint),
/* harmony export */   findNodeAtPoint: () => (/* binding */ findNodeAtPoint),
/* harmony export */   getDefaultNodes: () => (/* binding */ getDefaultNodes),
/* harmony export */   moveAreaNode: () => (/* binding */ moveAreaNode),
/* harmony export */   normalizeNodesForShapeType: () => (/* binding */ normalizeNodesForShapeType)
/* harmony export */ });
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./canvas */ "./src/admin/canvas.ts");
/* harmony import */ var _shared_map_geometry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/map-geometry */ "./src/shared/map-geometry.ts");


// Path building and area hit-testing live in src/shared/map-geometry.ts so
// the editor and the frontend map block trace identical shapes.

const NODE_HALF = 5;

// ── Shape helpers ─────────────────────────────────────────────────────────────

// Nodes are TL(0) TR(1) BR(2) BL(3); adjacent pairs share one axis.
function applyRectangleConstraint(nodes, movedIdx, newX, newY) {
  if (nodes.length !== 4) return null;
  const n = nodes.map(nd => ({
    ...nd
  }));
  n[movedIdx] = {
    x: newX,
    y: newY
  };
  switch (movedIdx) {
    case 0:
      n[1].y = newY;
      n[3].x = newX;
      break;
    case 1:
      n[0].y = newY;
      n[2].x = newX;
      break;
    case 2:
      n[3].y = newY;
      n[1].x = newX;
      break;
    case 3:
      n[2].y = newY;
      n[0].x = newX;
      break;
  }
  return n;
}
function getDefaultNodes(shapeType) {
  if (shapeType === 'CIRCLE') {
    return [{
      x: 0.5,
      y: 0.5
    }, {
      x: 0.7,
      y: 0.65
    }];
  }
  return [{
    x: 0.25,
    y: 0.25
  }, {
    x: 0.75,
    y: 0.25
  }, {
    x: 0.75,
    y: 0.75
  }, {
    x: 0.25,
    y: 0.75
  }];
}

/**
 * Moves one node of an area to new normalized (0–1) coordinates, honoring
 * the shape's constraints: rectangles keep their corners axis-aligned, and
 * moving a circle's center drags the radius node along. Returns a new array.
 */
function moveAreaNode(area, idx, newX, newY) {
  const st = area.shape_type || 'POLYGON';
  let updated = (area.nodes || []).map(n => ({
    ...n
  }));
  if (st === 'RECTANGLE') {
    updated = applyRectangleConstraint(updated, idx, newX, newY) || updated;
  } else if (st === 'CIRCLE' && idx === 0) {
    const dx = newX - updated[0].x;
    const dy = newY - updated[0].y;
    updated[0] = {
      x: newX,
      y: newY
    };
    if (updated[1]) updated[1] = {
      x: updated[1].x + dx,
      y: updated[1].y + dy
    };
  } else {
    updated[idx] = {
      x: newX,
      y: newY
    };
  }
  return updated;
}

/** Whether a node can be removed from the shape (fixed-node shapes can't shrink). */
function canRemoveAreaNode(area) {
  const st = area.shape_type || 'POLYGON';
  return (st === 'POLYGON' || st === 'BEZIER') && (area.nodes || []).length > 3;
}
function normalizeNodesForShapeType(nodes, shapeType) {
  if (shapeType === 'RECTANGLE') {
    return nodes.length === 4 ? nodes : getDefaultNodes('RECTANGLE');
  }
  if (shapeType === 'CIRCLE') {
    if (nodes.length >= 2) return nodes.slice(0, 2);
    if (nodes.length === 1) return [nodes[0], {
      x: nodes[0].x + 0.2,
      y: nodes[0].y + 0.15
    }];
    return getDefaultNodes('CIRCLE');
  }
  return nodes;
}
function getLiveNodes(nodes, shapeType, movingIdx, cursor, W, H) {
  if (movingIdx === null || !cursor) return nodes;
  const newX = cursor.x / W;
  const newY = cursor.y / H;
  if (shapeType === 'RECTANGLE') {
    return applyRectangleConstraint(nodes, movingIdx, newX, newY) || nodes;
  }
  const live = nodes.map(n => ({
    ...n
  }));
  if (shapeType === 'CIRCLE' && movingIdx === 0) {
    const dx = newX - nodes[0].x;
    const dy = newY - nodes[0].y;
    live[0] = {
      x: newX,
      y: newY
    };
    if (live[1]) live[1] = {
      x: nodes[1].x + dx,
      y: nodes[1].y + dy
    };
  } else {
    live[movingIdx] = {
      x: newX,
      y: newY
    };
  }
  return live;
}

// ── Canvas rendering ──────────────────────────────────────────────────────────

// repoNodeIdx / repoCursor / focusedNodeIdx are only meaningful when
// isSelected === true. focusedNodeIdx marks the keyboard-focused node
// (Tab cycling); a node being repositioned takes visual precedence.
function drawAreaShape(ctx, area, W, H, isSelected, repoNodeIdx, repoCursor, focusedNodeIdx = null) {
  const rawNodes = area.nodes || [];
  if (!rawNodes.length) return;
  const shapeType = area.shape_type || 'POLYGON';
  const liveNodes = isSelected ? getLiveNodes(rawNodes, shapeType, repoNodeIdx, repoCursor, W, H) : rawNodes;
  const minNodes = shapeType === 'CIRCLE' ? 2 : 3;
  if (liveNodes.length >= minNodes) {
    const styles = area.canvas_styles || {};
    const fill = styles.fill || '#2271b1';
    const fillOpacity = styles.fillOpacity ?? 0.3;
    const stroke = styles.stroke || '#2271b1';
    const strokeWidth = styles.strokeWidth || 2;
    (0,_shared_map_geometry__WEBPACK_IMPORTED_MODULE_1__.buildAreaPathFromNodes)(ctx, liveNodes, shapeType, W, H);
    ctx.save();
    ctx.globalAlpha = fillOpacity;
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = isSelected ? Math.max(strokeWidth, 2) : strokeWidth;
    ctx.stroke();
  }
  if (!isSelected) return;
  liveNodes.forEach((node, idx) => {
    const isRepoNode = repoNodeIdx === idx;
    const isFocusedNode = !isRepoNode && repoNodeIdx === null && focusedNodeIdx === idx;
    ctx.beginPath();
    ctx.rect(node.x * W - NODE_HALF, node.y * H - NODE_HALF, NODE_HALF * 2, NODE_HALF * 2);
    if (isFocusedNode) {
      ctx.fillStyle = '#2271b1';
      ctx.fill();
    }
    ctx.strokeStyle = isRepoNode ? '#e75252' : '#2271b1';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}
async function drawAreasOnCanvas(canvas, drawState, areas, selectedAreaId, repoNodeIdx, repoCursor, focusedNodeIdx = null) {
  await (0,_canvas__WEBPACK_IMPORTED_MODULE_0__.drawMapCanvas)(canvas, drawState);
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  for (const area of areas) {
    const isSel = area.id === selectedAreaId;
    drawAreaShape(ctx, area, W, H, isSel, isSel ? repoNodeIdx : null, isSel ? repoCursor : null, isSel ? focusedNodeIdx : null);
  }
}

// ── Hit detection (editor-only: node handles) ─────────────────────────────────

function findNodeAtPoint(ctx, x, y, nodes, W, H) {
  for (let i = nodes.length - 1; i >= 0; i--) {
    ctx.beginPath();
    ctx.rect(nodes[i].x * W - NODE_HALF, nodes[i].y * H - NODE_HALF, NODE_HALF * 2, NODE_HALF * 2);
    if (ctx.isPointInPath(x, y)) return i;
  }
  return -1;
}

/***/ },

/***/ "./src/admin/canvas.ts"
/*!*****************************!*\
  !*** ./src/admin/canvas.ts ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   drawFullCanvas: () => (/* binding */ drawFullCanvas),
/* harmony export */   drawMapCanvas: () => (/* binding */ drawMapCanvas),
/* harmony export */   getCanvasCoords: () => (/* binding */ getCanvasCoords),
/* harmony export */   settingsToDrawState: () => (/* binding */ settingsToDrawState)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/admin/utils.ts");

async function drawMapCanvas(canvasEl, state) {
  const ctx = canvasEl.getContext('2d');
  const width = state.width;
  const height = Math.round(width / state.aspectRatio);
  canvasEl.width = width;
  canvasEl.height = height;
  ctx.clearRect(0, 0, width, height);
  if (state.bgType === 'image') {
    const bgImg = await (0,_utils__WEBPACK_IMPORTED_MODULE_0__.loadImage)(state.bgImageUrl);
    if (bgImg) {
      const scale = Math.max(width / bgImg.naturalWidth, height / bgImg.naturalHeight);
      const drawW = bgImg.naturalWidth * scale;
      const drawH = bgImg.naturalHeight * scale;
      ctx.drawImage(bgImg, (width - drawW) / 2, (height - drawH) / 2, drawW, drawH);
    } else {
      ctx.fillStyle = '#888';
      ctx.fillRect(0, 0, width, height);
    }
  } else {
    ctx.fillStyle = state.bgColor;
    ctx.fillRect(0, 0, width, height);
  }
  const mapImg = await (0,_utils__WEBPACK_IMPORTED_MODULE_0__.loadImage)(state.imgUrl);
  if (mapImg) {
    const drawW = width * state.imageW;
    const drawH = drawW * (mapImg.naturalHeight / mapImg.naturalWidth);
    ctx.drawImage(mapImg, width * state.imageX, height * state.imageY, drawW, drawH);
  }
}
function getCanvasCoords(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: Math.round((event.clientX - rect.left) * (canvas.width / rect.width)),
    y: Math.round((event.clientY - rect.top) * (canvas.height / rect.height))
  };
}
function settingsToDrawState(s) {
  return {
    width: s.width,
    aspectRatio: s.aspectRatio,
    bgType: s.bgType,
    bgColor: s.bgColor,
    bgImageUrl: s.bgImageUrl,
    imgUrl: s.imageUrl,
    imageX: s.imageX,
    imageY: s.imageY,
    imageW: s.imageW
  };
}

// drawAreaFn / drawObjectFn are passed in to avoid circular imports.
async function drawFullCanvas(canvas, objects, areas, state, drawAreaFn, drawObjectFn) {
  await drawMapCanvas(canvas, state);
  const ctx = canvas.getContext('2d');
  for (const area of areas) drawAreaFn(ctx, area, canvas.width, canvas.height, false, null, null);
  for (const obj of objects) await drawObjectFn(ctx, obj, false);
}

/***/ },

/***/ "./src/admin/icons.ts"
/*!****************************!*\
  !*** ./src/admin/icons.ts ***!
  \****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   iconLibraryCache: () => (/* binding */ iconLibraryCache),
/* harmony export */   loadIconLibraryIntoCache: () => (/* binding */ loadIconLibraryIntoCache)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/admin/utils.ts");

let iconLibraryCache = null;
async function loadIconLibraryIntoCache() {
  try {
    const res = await (0,_utils__WEBPACK_IMPORTED_MODULE_0__.apiFetch)('GET', '/icons');
    const data = await res.json();
    if (res.ok) iconLibraryCache = data;
  } catch {
    iconLibraryCache = [];
  }
}

/***/ },

/***/ "./src/admin/labels.ts"
/*!*****************************!*\
  !*** ./src/admin/labels.ts ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   drawLabelShape: () => (/* reexport safe */ _shared_map_geometry__WEBPACK_IMPORTED_MODULE_1__.drawLabelShape),
/* harmony export */   drawLabelsOnCanvas: () => (/* binding */ drawLabelsOnCanvas),
/* harmony export */   findLabelPartAtPoint: () => (/* reexport safe */ _shared_map_geometry__WEBPACK_IMPORTED_MODULE_1__.findLabelPartAtPoint),
/* harmony export */   measureLabelBox: () => (/* reexport safe */ _shared_map_geometry__WEBPACK_IMPORTED_MODULE_1__.measureLabelBox),
/* harmony export */   traceRoundedRect: () => (/* reexport safe */ _shared_map_geometry__WEBPACK_IMPORTED_MODULE_1__.traceRoundedRect)
/* harmony export */ });
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./canvas */ "./src/admin/canvas.ts");
/* harmony import */ var _shared_map_geometry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/map-geometry */ "./src/shared/map-geometry.ts");


// Geometry, drawing, and hit-testing live in src/shared/map-geometry.ts so
// the editor and the frontend map block render labels identically. This
// module only adds the editor-specific composition (map background + all
// labels + selection ring / empty placeholder).

async function drawLabelsOnCanvas(canvas, drawState, labels, selectedLabelId) {
  await (0,_canvas__WEBPACK_IMPORTED_MODULE_0__.drawMapCanvas)(canvas, drawState);
  const ctx = canvas.getContext('2d');
  for (const label of labels) {
    (0,_shared_map_geometry__WEBPACK_IMPORTED_MODULE_1__.drawLabelShape)(ctx, label, {
      selected: selectedLabelId === label.id,
      showEmptyPlaceholder: true
    });
  }
}

/***/ },

/***/ "./src/admin/objects.ts"
/*!******************************!*\
  !*** ./src/admin/objects.ts ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   drawObjectMarker: () => (/* binding */ drawObjectMarker),
/* harmony export */   drawObjectsOnCanvas: () => (/* binding */ drawObjectsOnCanvas),
/* harmony export */   findObjectAtPoint: () => (/* reexport safe */ _shared_map_geometry__WEBPACK_IMPORTED_MODULE_2__.findObjectAtPoint)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/admin/utils.ts");
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./canvas */ "./src/admin/canvas.ts");
/* harmony import */ var _shared_map_geometry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/map-geometry */ "./src/shared/map-geometry.ts");


// Marker hit-testing lives in src/shared/map-geometry.ts so the editor and
// the frontend map block agree on the clickable region.


// ── Canvas rendering ──────────────────────────────────────────────────────────

function drawFallbackMarker(ctx, x, y, size, fill, stroke) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.fillStyle = fill || '#2271b1';
  ctx.strokeStyle = stroke || '#fff';
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}
async function drawObjectMarker(ctx, obj, isSelected) {
  const size = obj.canvas_styles?.size ?? 32;
  const fill = obj.canvas_styles?.fillStyle ?? '#ffffff';
  const stroke = obj.canvas_styles?.strokeStyle ?? '#2271b1';
  if (obj.icon_url) {
    const img = obj.icon_mime === 'image/svg+xml' ? await (0,_utils__WEBPACK_IMPORTED_MODULE_0__.loadSvgWithColors)(obj.icon_url, fill, stroke) : await (0,_utils__WEBPACK_IMPORTED_MODULE_0__.loadImage)(obj.icon_url);
    if (img) {
      ctx.drawImage(img, obj.x - size / 2, obj.y - size / 2, size, size);
    } else {
      drawFallbackMarker(ctx, obj.x, obj.y, size, fill, stroke);
    }
  } else {
    drawFallbackMarker(ctx, obj.x, obj.y, size, fill, stroke);
  }
  if (isSelected) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, size / 2 + 4, 0, Math.PI * 2);
    ctx.strokeStyle = '#2271b1';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.stroke();
    ctx.restore();
  }
}
async function drawObjectsOnCanvas(canvas, drawState, objects, selectedObjectId, repositioningId, repositionCursor) {
  await (0,_canvas__WEBPACK_IMPORTED_MODULE_1__.drawMapCanvas)(canvas, drawState);
  const ctx = canvas.getContext('2d');
  for (const obj of objects) {
    if (repositioningId === obj.id && repositionCursor) {
      await drawObjectMarker(ctx, {
        ...obj,
        ...repositionCursor
      }, true);
    } else {
      await drawObjectMarker(ctx, obj, selectedObjectId === obj.id);
    }
  }
}

/***/ },

/***/ "./src/admin/utils.ts"
/*!****************************!*\
  !*** ./src/admin/utils.ts ***!
  \****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   apiFetch: () => (/* binding */ apiFetch),
/* harmony export */   isTypingTarget: () => (/* binding */ isTypingTarget),
/* harmony export */   loadImage: () => (/* binding */ loadImage),
/* harmony export */   loadSvgWithColors: () => (/* binding */ loadSvgWithColors)
/* harmony export */ });
function apiFetch(method, path, body) {
  const headers = {
    'X-WP-Nonce': window.cnsMapSuite.nonce
  };
  const opts = {
    method,
    headers
  };
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  return fetch(window.cnsMapSuite.restUrl + path, opts);
}

// ── Keyboard ──────────────────────────────────────────────────────────────────

/**
 * True when the event originates from a form field, so canvas keyboard
 * shortcuts don't hijack typing (Enter in a text input, Backspace while
 * editing, arrow keys in number fields, …).
 */
function isTypingTarget(e) {
  const t = e.target;
  return !!t && typeof t.closest === 'function' && !!t.closest('input, textarea, select, [contenteditable="true"]');
}

// ── Image cache ───────────────────────────────────────────────────────────────

const imageCache = {};
function loadImage(url) {
  if (!url) return Promise.resolve(null);
  if (imageCache[url]) return Promise.resolve(imageCache[url]);
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      imageCache[url] = img;
      resolve(img);
    };
    img.onerror = () => {
      resolve(null);
    };
    img.src = url;
  });
}
async function loadSvgWithColors(url, fill, stroke) {
  const key = `${url}|${fill ?? ''}|${stroke ?? ''}`;
  if (imageCache[key]) return imageCache[key];
  try {
    const resp = await fetch(url, {
      credentials: 'same-origin'
    });
    const text = await resp.text();
    const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
    const svg = doc.documentElement;
    if (fill) svg.setAttribute('fill', fill);
    if (stroke) svg.setAttribute('stroke', stroke);
    const blob = new Blob([new XMLSerializer().serializeToString(doc)], {
      type: 'image/svg+xml'
    });
    const blobUrl = URL.createObjectURL(blob);
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(blobUrl);
        imageCache[key] = img;
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(blobUrl);
        resolve(null);
      };
      img.src = blobUrl;
    });
  } catch {
    return null;
  }
}

/***/ },

/***/ "./src/shared/map-geometry.ts"
/*!************************************!*\
  !*** ./src/shared/map-geometry.ts ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildAreaPathFromNodes: () => (/* binding */ buildAreaPathFromNodes),
/* harmony export */   buildPolygonPath: () => (/* binding */ buildPolygonPath),
/* harmony export */   drawLabelShape: () => (/* binding */ drawLabelShape),
/* harmony export */   findAreaAtPoint: () => (/* binding */ findAreaAtPoint),
/* harmony export */   findLabelPartAtPoint: () => (/* binding */ findLabelPartAtPoint),
/* harmony export */   findObjectAtPoint: () => (/* binding */ findObjectAtPoint),
/* harmony export */   measureLabelBox: () => (/* binding */ measureLabelBox),
/* harmony export */   traceRoundedRect: () => (/* binding */ traceRoundedRect)
/* harmony export */ });
/**
 * Canvas geometry shared between the admin editor (src/admin) and the
 * frontend map block (src/blocks/map/view.js). Both bundles come out of the
 * same webpack build, so keeping the math here makes editor and frontend
 * pixel-identical by construction — any change to hit areas, label boxes, or
 * shape paths lands in both automatically.
 */

// ── Area / region paths ───────────────────────────────────────────────────────

function buildPolygonPath(ctx, nodes, W, H) {
  ctx.moveTo(nodes[0].x * W, nodes[0].y * H);
  for (let i = 1; i < nodes.length; i++) {
    ctx.lineTo(nodes[i].x * W, nodes[i].y * H);
  }
  ctx.closePath();
}
function buildBezierPath(ctx, nodes, W, H) {
  const n = nodes.length;
  const startX = (nodes[n - 1].x + nodes[0].x) / 2 * W;
  const startY = (nodes[n - 1].y + nodes[0].y) / 2 * H;
  ctx.moveTo(startX, startY);
  for (let i = 0; i < n; i++) {
    const cp = nodes[i];
    const next = nodes[(i + 1) % n];
    ctx.quadraticCurveTo(cp.x * W, cp.y * H, (cp.x + next.x) / 2 * W, (cp.y + next.y) / 2 * H);
  }
  ctx.closePath();
}
function buildCirclePath(ctx, nodes, W, H) {
  const cx = nodes[0].x * W;
  const cy = nodes[0].y * H;
  const rx = Math.max(Math.abs(nodes[1].x - nodes[0].x) * W, 1);
  const ry = Math.max(Math.abs(nodes[1].y - nodes[0].y) * H, 1);
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
}
function buildAreaPathFromNodes(ctx, nodes, shapeType, W, H) {
  ctx.beginPath();
  if (!nodes.length) return;
  switch (shapeType) {
    case 'BEZIER':
      if (nodes.length >= 3) buildBezierPath(ctx, nodes, W, H);
      break;
    case 'CIRCLE':
      if (nodes.length >= 2) buildCirclePath(ctx, nodes, W, H);
      break;
    case 'RECTANGLE':
    default:
      if (nodes.length >= 3) buildPolygonPath(ctx, nodes, W, H);
      break;
  }
}

// ── Hit detection ─────────────────────────────────────────────────────────────

function findObjectAtPoint(ctx, x, y, objects) {
  for (let i = objects.length - 1; i >= 0; i--) {
    const obj = objects[i];
    const size = obj.canvas_styles?.size ?? 32;
    const half = size / 2;
    ctx.beginPath();
    ctx.rect(obj.x - half, obj.y - half, size, size);
    if (ctx.isPointInPath(x, y)) return obj;
  }
  return null;
}
function findAreaAtPoint(ctx, x, y, areas, W, H) {
  for (let i = areas.length - 1; i >= 0; i--) {
    const area = areas[i];
    const nodes = area.nodes || [];
    const shapeType = area.shape_type || 'POLYGON';
    const minNodes = shapeType === 'CIRCLE' ? 2 : 3;
    if (nodes.length < minNodes) continue;
    buildAreaPathFromNodes(ctx, nodes, shapeType, W, H);
    if (ctx.isPointInPath(x, y)) return area;
  }
  return null;
}

// ── Labels ────────────────────────────────────────────────────────────────────
// 'centered'  — label box centered on (x, y).
// 'indicator' — dot at (x, y) with a leader line to the label box at
//               (x + offset_x, y + offset_y); the line is drawn first so the
//               box covers the segment that would cross it.

const PAD_X = 8;
const PAD_Y = 5;

/** Computes the label box in canvas pixels (sets ctx.font as a side effect). */
function measureLabelBox(ctx, label) {
  const fontSize = label.canvas_styles?.fontSize || 14;
  ctx.font = `bold ${fontSize}px sans-serif`;
  const textW = ctx.measureText(label.text || '').width;
  const w = textW + PAD_X * 2;
  const h = fontSize + PAD_Y * 2;
  const cx = label.placement === 'indicator' ? label.x + (label.offset_x ?? 40) : label.x;
  const cy = label.placement === 'indicator' ? label.y + (label.offset_y ?? -40) : label.y;
  return {
    left: cx - w / 2,
    top: cy - h / 2,
    w,
    h,
    cx,
    cy,
    fontSize
  };
}
function traceRoundedRect(ctx, x, y, w, h, r) {
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.rect(x, y, w, h);
  }
}
function drawLabelShape(ctx, label, opts = {}) {
  const bg = label.canvas_styles?.bgColor || '#ffffff';
  const border = label.canvas_styles?.borderColor || '#1e1e1e';
  const textColor = label.canvas_styles?.textColor || '#1e1e1e';
  const box = measureLabelBox(ctx, label);
  ctx.save();

  // Leader line + anchor dot first, so the box covers the inner segment.
  if (label.placement === 'indicator') {
    ctx.beginPath();
    ctx.moveTo(label.x, label.y);
    ctx.lineTo(box.cx, box.cy);
    ctx.strokeStyle = border;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(label.x, label.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = border;
    ctx.fill();
  }
  ctx.beginPath();
  traceRoundedRect(ctx, box.left, box.top, box.w, box.h, 4);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.strokeStyle = border;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.font = `bold ${box.fontSize}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = textColor;
  ctx.fillText(label.text || (opts.showEmptyPlaceholder ? '(empty label)' : ''), box.cx, box.cy);
  if (opts.selected) {
    ctx.beginPath();
    traceRoundedRect(ctx, box.left - 4, box.top - 4, box.w + 8, box.h + 8, 6);
    ctx.strokeStyle = '#2271b1';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.stroke();
  }
  ctx.restore();
}

/** Which part of a label was hit: the anchor dot or the text box. */

/**
 * Hit test that distinguishes the anchor dot (indicator mode) from the text
 * box. The dot is checked first with a generous radius so it stays grabbable
 * next to the box. Reverse order so the top-most drawn label wins.
 */
function findLabelPartAtPoint(ctx, x, y, labels) {
  for (let i = labels.length - 1; i >= 0; i--) {
    const label = labels[i];
    if (label.placement === 'indicator') {
      ctx.beginPath();
      ctx.arc(label.x, label.y, 8, 0, Math.PI * 2);
      if (ctx.isPointInPath(x, y)) return {
        label,
        part: 'anchor'
      };
    }
    const box = measureLabelBox(ctx, label);
    ctx.beginPath();
    ctx.rect(box.left, box.top, box.w, box.h);
    if (ctx.isPointInPath(x, y)) return {
      label,
      part: 'box'
    };
  }
  return null;
}

/***/ },

/***/ "./src/admin/admin.scss"
/*!******************************!*\
  !*** ./src/admin/admin.scss ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "react/jsx-runtime"
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
(module) {

module.exports = window["ReactJSXRuntime"];

/***/ },

/***/ "@wordpress/components"
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
(module) {

module.exports = window["wp"]["components"];

/***/ },

/***/ "@wordpress/element"
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
(module) {

module.exports = window["wp"]["element"];

/***/ },

/***/ "@wordpress/i18n"
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["i18n"];

/***/ },

/***/ "@wordpress/media-utils"
/*!************************************!*\
  !*** external ["wp","mediaUtils"] ***!
  \************************************/
(module) {

module.exports = window["wp"]["mediaUtils"];

/***/ },

/***/ "@wordpress/primitives"
/*!************************************!*\
  !*** external ["wp","primitives"] ***!
  \************************************/
(module) {

module.exports = window["wp"]["primitives"];

/***/ },

/***/ "./node_modules/@wordpress/icons/build-module/library/chevron-left-small.mjs"
/*!***********************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/chevron-left-small.mjs ***!
  \***********************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ chevron_left_small_default)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/icons/src/library/chevron-left-small.tsx


var chevron_left_small_default = /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, { d: "m13.1 16-3.4-4 3.4-4 1.1 1-2.6 3 2.6 3-1.1 1z" }) });

//# sourceMappingURL=chevron-left-small.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/icons/build-module/library/chevron-right-small.mjs"
/*!************************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/chevron-right-small.mjs ***!
  \************************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ chevron_right_small_default)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/icons/src/library/chevron-right-small.tsx


var chevron_right_small_default = /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, { d: "M10.8622 8.04053L14.2805 12.0286L10.8622 16.0167L9.72327 15.0405L12.3049 12.0286L9.72327 9.01672L10.8622 8.04053Z" }) });

//# sourceMappingURL=chevron-right-small.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/icons/build-module/library/image.mjs"
/*!**********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/image.mjs ***!
  \**********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ image_default)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/icons/src/library/image.tsx


var image_default = /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, { d: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 4.5h14c.3 0 .5.2.5.5v8.4l-3-2.9c-.3-.3-.8-.3-1 0L11.9 14 9 12c-.3-.2-.6-.2-.8 0l-3.6 2.6V5c-.1-.3.1-.5.4-.5zm14 15H5c-.3 0-.5-.2-.5-.5v-2.4l4.1-3 3 1.9c.3.2.7.2.9-.1L16 12l3.5 3.4V19c0 .3-.2.5-.5.5z" }) });

//# sourceMappingURL=image.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/icons/build-module/library/pencil.mjs"
/*!***********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/pencil.mjs ***!
  \***********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ pencil_default)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/icons/src/library/pencil.tsx


var pencil_default = /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, { d: "m19 7-3-3-8.5 8.5-1 4 4-1L19 7Zm-7 11.5H5V20h7v-1.5Z" }) });

//# sourceMappingURL=pencil.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/icons/build-module/library/trash.mjs"
/*!**********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/trash.mjs ***!
  \**********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ trash_default)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/icons/src/library/trash.tsx


var trash_default = /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, { fillRule: "evenodd", clipRule: "evenodd", d: "M12 5.5A2.25 2.25 0 0 0 9.878 7h4.244A2.251 2.251 0 0 0 12 5.5ZM12 4a3.751 3.751 0 0 0-3.675 3H5v1.5h1.27l.818 8.997a2.75 2.75 0 0 0 2.739 2.501h4.347a2.75 2.75 0 0 0 2.738-2.5L17.73 8.5H19V7h-3.325A3.751 3.751 0 0 0 12 4Zm4.224 4.5H7.776l.806 8.861a1.25 1.25 0 0 0 1.245 1.137h4.347a1.25 1.25 0 0 0 1.245-1.137l.805-8.861Z" }) });

//# sourceMappingURL=trash.mjs.map


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*****************************!*\
  !*** ./src/admin/index.tsx ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _app_MapEditorApp__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app/MapEditorApp */ "./src/admin/app/MapEditorApp.tsx");
/* harmony import */ var _app_IconLibraryApp__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/IconLibraryApp */ "./src/admin/app/IconLibraryApp.tsx");
/* harmony import */ var _admin_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./admin.scss */ "./src/admin/admin.scss");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





document.addEventListener('DOMContentLoaded', () => {
  const editorEl = document.getElementById('cns-admin-root');
  if (editorEl) (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createRoot)(editorEl).render(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_app_MapEditorApp__WEBPACK_IMPORTED_MODULE_1__["default"], {}));
  const iconsEl = document.getElementById('cns-icons-root');
  if (iconsEl) (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createRoot)(iconsEl).render(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_app_IconLibraryApp__WEBPACK_IMPORTED_MODULE_2__["default"], {}));
  document.body.addEventListener('click', e => {
    const link = e.target.closest('a[data-confirm]');
    if (link && !window.confirm(link.dataset.confirm)) {
      e.preventDefault();
    }
  });
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map