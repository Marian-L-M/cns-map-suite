/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/admin/app/ContextPanel.js"
/*!***************************************!*\
  !*** ./src/admin/app/ContextPanel.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ContextPanel)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _forms_ObjectForm_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./forms/ObjectForm.js */ "./src/admin/app/forms/ObjectForm.js");
/* harmony import */ var _forms_AreaForm_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./forms/AreaForm.js */ "./src/admin/app/forms/AreaForm.js");
/* harmony import */ var _forms_NodeList_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./forms/NodeList.js */ "./src/admin/app/forms/NodeList.js");
/* harmony import */ var _shared_SaveStatus_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./shared/SaveStatus.js */ "./src/admin/app/shared/SaveStatus.js");
/* harmony import */ var _icons_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../icons.js */ "./src/admin/icons.js");
/* harmony import */ var _areas_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../areas.js */ "./src/admin/areas.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);








function ContextPanel({
  activeTab,
  selectedObject,
  selectedArea,
  onObjectSave,
  onObjectDelete,
  onObjectClose,
  onObjectReposition,
  onAreaSave,
  onAreaDelete,
  onAreaClose,
  onAreaNodesUpdate,
  onAreaShapeTypeChange
}) {
  const [objFormData, setObjFormData] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [areaFormData, setAreaFormData] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [icons, setIcons] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(_icons_js__WEBPACK_IMPORTED_MODULE_5__.iconLibraryCache || []);
  const [status, setStatus] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({
    text: '',
    type: ''
  });
  const [saving, setSaving] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);

  // Sync form when selected item changes
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (selectedObject) {
      setObjFormData((0,_forms_ObjectForm_js__WEBPACK_IMPORTED_MODULE_1__.defaultObjectFormData)(selectedObject, null, null));
      setStatus({
        text: '',
        type: ''
      });
      if (!_icons_js__WEBPACK_IMPORTED_MODULE_5__.iconLibraryCache) {
        (0,_icons_js__WEBPACK_IMPORTED_MODULE_5__.loadIconLibraryIntoCache)().then(() => setIcons(_icons_js__WEBPACK_IMPORTED_MODULE_5__.iconLibraryCache || []));
      }
    }
  }, [selectedObject?.id]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (selectedArea) {
      setAreaFormData((0,_forms_AreaForm_js__WEBPACK_IMPORTED_MODULE_2__.defaultAreaFormData)(selectedArea));
      setStatus({
        text: '',
        type: ''
      });
    }
  }, [selectedArea?.id]);

  // Empty state
  if (!selectedObject && !selectedArea) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("aside", {
      className: "cns-editor-context",
      "aria-label": "Context panel",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
        className: "cns-editor-context__empty",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
          children: activeTab === 'areas' ? 'Select an area on the canvas to edit it here.' : 'Select an object on the canvas to edit it here.'
        })
      })
    });
  }
  const isObject = !!selectedObject;
  const title = isObject ? selectedObject.title || '(no title)' : selectedArea.title || '(no title)';
  async function handleSave() {
    setSaving(true);
    setStatus({
      text: 'Saving…',
      type: ''
    });
    try {
      if (isObject) {
        const data = await onObjectSave((0,_forms_ObjectForm_js__WEBPACK_IMPORTED_MODULE_1__.collectObjectPayload)(objFormData));
        if (data?.title) setObjFormData(prev => ({
          ...prev,
          title: data.title
        }));
      } else {
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
    } else {
      if (!confirm('Delete this area?')) return;
      await onAreaDelete();
    }
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("aside", {
    className: "cns-editor-context",
    "aria-label": "Context panel",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      id: "cns-context-form",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "cns-editor-context__header",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
          className: "cns-editor-context__title",
          children: title
        }), isObject && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
          type: "button",
          className: "button button-small",
          onClick: onObjectReposition,
          children: "Reposition"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
          type: "button",
          className: "cns-editor-context__close",
          "aria-label": "Close",
          onClick: isObject ? onObjectClose : onAreaClose,
          children: "\xD7"
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "cns-editor-context__body",
        children: [isObject && objFormData && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_forms_ObjectForm_js__WEBPACK_IMPORTED_MODULE_1__["default"], {
          formData: objFormData,
          onChange: setObjFormData,
          icons: icons
        }), !isObject && areaFormData && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_forms_AreaForm_js__WEBPACK_IMPORTED_MODULE_2__["default"], {
            formData: areaFormData,
            onChange: setAreaFormData,
            onShapeTypeChange: st => {
              onAreaShapeTypeChange?.(selectedArea.id, st);
              // Keep local form in sync
              setAreaFormData(prev => ({
                ...prev,
                shape_type: st
              }));
            }
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_forms_NodeList_js__WEBPACK_IMPORTED_MODULE_3__["default"], {
            area: selectedArea,
            onNodesChange: nodes => onAreaNodesUpdate?.(selectedArea.id, nodes)
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "cns-editor-context__footer",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_shared_SaveStatus_js__WEBPACK_IMPORTED_MODULE_4__["default"], {
          text: status.text,
          type: status.type
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
          type: "button",
          className: "button button-small button-primary",
          disabled: saving,
          onClick: handleSave,
          children: "Save"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
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

/***/ "./src/admin/app/EditorHeader.js"
/*!***************************************!*\
  !*** ./src/admin/app/EditorHeader.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EditorHeader)
/* harmony export */ });
/* harmony import */ var _shared_SaveStatus_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shared/SaveStatus.js */ "./src/admin/app/shared/SaveStatus.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


function EditorHeader({
  pageTitle,
  overviewUrl,
  viewUrl,
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
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_shared_SaveStatus_js__WEBPACK_IMPORTED_MODULE_0__["default"], {
        text: saveStatus.text,
        type: saveStatus.type
      }), viewUrl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("a", {
        href: viewUrl,
        className: "button",
        target: "_blank",
        rel: "noopener noreferrer",
        children: "View Map"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
        className: "button button-primary",
        onClick: onSave,
        children: "Save Map"
      })]
    })]
  });
}

/***/ },

/***/ "./src/admin/app/IconLibraryApp.js"
/*!*****************************************!*\
  !*** ./src/admin/app/IconLibraryApp.js ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ IconLibraryApp)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./src/admin/utils.js");
/* harmony import */ var _icons_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../icons.js */ "./src/admin/icons.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/* global wp */




function IconLibraryApp() {
  const [icons, setIcons] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    (0,_icons_js__WEBPACK_IMPORTED_MODULE_2__.loadIconLibraryIntoCache)().then(() => setIcons(_icons_js__WEBPACK_IMPORTED_MODULE_2__.iconLibraryCache || []));
  }, []);
  function handleAdd() {
    const frame = wp.media({
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
      try {
        const res = await (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.apiFetch)('POST', '/icons', {
          attachment_id: att.id
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to add icon.');
        setIcons(prev => [...prev, data]);
      } catch (err) {
        alert(err.message);
      }
    });
    frame.open();
  }
  async function handleRemove(id) {
    if (!confirm('Remove this icon from the library? (The attachment itself is kept.)')) return;
    try {
      const res = await (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.apiFetch)('DELETE', `/icons/${id}`);
      if (!res.ok) throw new Error('Remove failed.');
      setIcons(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
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
        children: "No icons yet. Click \"Add Icon\" to upload an SVG."
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

/***/ "./src/admin/app/MapEditorApp.js"
/*!***************************************!*\
  !*** ./src/admin/app/MapEditorApp.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MapEditorApp)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _EditorHeader_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EditorHeader.js */ "./src/admin/app/EditorHeader.js");
/* harmony import */ var _TabBar_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TabBar.js */ "./src/admin/app/TabBar.js");
/* harmony import */ var _ContextPanel_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ContextPanel.js */ "./src/admin/app/ContextPanel.js");
/* harmony import */ var _panels_SettingsPanel_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./panels/SettingsPanel.js */ "./src/admin/app/panels/SettingsPanel.js");
/* harmony import */ var _panels_ObjectsPanel_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./panels/ObjectsPanel.js */ "./src/admin/app/panels/ObjectsPanel.js");
/* harmony import */ var _panels_AreasPanel_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./panels/AreasPanel.js */ "./src/admin/app/panels/AreasPanel.js");
/* harmony import */ var _panels_HierarchyPanel_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./panels/HierarchyPanel.js */ "./src/admin/app/panels/HierarchyPanel.js");
/* harmony import */ var _panels_PreviewPanel_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./panels/PreviewPanel.js */ "./src/admin/app/panels/PreviewPanel.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../utils.js */ "./src/admin/utils.js");
/* harmony import */ var _areas_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../areas.js */ "./src/admin/areas.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__);












function buildInitialSettings() {
  const d = window.cnsMapEditor || {};
  return {
    title: d.title ?? '',
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
    bgImageUrl: d.bgImageUrl ?? ''
  };
}
function MapEditorApp() {
  const d = window.cnsMapEditor || {};
  const mapId = d.mapId || 0;
  const isNew = d.isNew || false;
  const overviewUrl = d.overviewUrl || '#';
  const viewUrl = d.viewUrl || '';
  const [settings, setSettings] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(buildInitialSettings);
  const [activeTab, setActiveTab] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('settings');
  const [objectsList, setObjectsList] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [areasList, setAreasList] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [selectedObjectId, setSelectedObjectId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [selectedAreaId, setSelectedAreaId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [repositioningObjId, setRepositioningObjId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [saveStatus, setSaveStatus] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({
    text: '',
    type: ''
  });
  const selectedObject = objectsList.find(o => o.id === selectedObjectId) || null;
  const selectedArea = areasList.find(a => a.id === selectedAreaId) || null;

  // ── Tab switching ─────────────────────────────────────────────────────────

  function handleTabChange(tab) {
    if (tab !== 'objects') {
      setSelectedObjectId(null);
      setRepositioningObjId(null);
    }
    if (tab !== 'areas') setSelectedAreaId(null);
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
      status: 'publish',
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
      bg_image_id: settings.bgImageId
    };
    try {
      const res = await (0,_utils_js__WEBPACK_IMPORTED_MODULE_9__.apiFetch)('POST', '/maps', payload);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Save failed.');
      if (data.created) {
        window.location.href = data.edit_url;
      } else {
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
    const res = await (0,_utils_js__WEBPACK_IMPORTED_MODULE_9__.apiFetch)('POST', `/objects/${selectedObjectId}`, formPayload);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Save failed.');
    setObjectsList(prev => prev.map(o => o.id === selectedObjectId ? data : o));
    return data;
  }
  async function handleObjectPositionUpdate(id, x, y) {
    const res = await (0,_utils_js__WEBPACK_IMPORTED_MODULE_9__.apiFetch)('PATCH', `/objects/${id}/position`, {
      x,
      y
    });
    const data = await res.json();
    if (res.ok) {
      setObjectsList(prev => prev.map(o => o.id === id ? data : o));
    }
  }

  // ── Area operations ───────────────────────────────────────────────────────

  async function handleAreaSave(formData) {
    if (!selectedAreaId) return;
    const area = areasList.find(a => a.id === selectedAreaId);
    if (!area) return;
    const payload = {
      ...formData,
      nodes: JSON.stringify(area.nodes)
    };
    const res = await (0,_utils_js__WEBPACK_IMPORTED_MODULE_9__.apiFetch)('POST', `/areas/${selectedAreaId}`, payload);
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
  }
  function handleAreaShapeTypeChange(areaId, shapeType) {
    setAreasList(prev => prev.map(a => {
      if (a.id !== areaId) return a;
      return {
        ...a,
        shape_type: shapeType,
        nodes: (0,_areas_js__WEBPACK_IMPORTED_MODULE_10__.normalizeNodesForShapeType)(a.nodes || [], shapeType)
      };
    }));
  }

  // ── Object add helper (used by ObjectsPanel) ──────────────────────────────

  async function handleObjectAdd(payload) {
    const res = await (0,_utils_js__WEBPACK_IMPORTED_MODULE_9__.apiFetch)('POST', `/maps/${mapId}/objects`, payload);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed.');
    setObjectsList(prev => [...prev, data]);
    return data;
  }
  async function handleObjectDeleteById(id) {
    const res = await (0,_utils_js__WEBPACK_IMPORTED_MODULE_9__.apiFetch)('DELETE', `/objects/${id}`);
    if (!res.ok) throw new Error('Delete failed.');
    setObjectsList(prev => prev.filter(o => o.id !== id));
    if (selectedObjectId === id) setSelectedObjectId(null);
  }
  async function handleAreaDeleteById(id) {
    const res = await (0,_utils_js__WEBPACK_IMPORTED_MODULE_9__.apiFetch)('DELETE', `/areas/${id}`);
    if (!res.ok) throw new Error('Delete failed.');
    setAreasList(prev => prev.filter(a => a.id !== id));
    if (selectedAreaId === id) setSelectedAreaId(null);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const pageTitle = isNew ? 'New Map' : `Edit: ${settings.title || '(no title)'}`;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
    className: "cns-map-editor wrap",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
      className: "cns-editor-layout",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
        className: "cns-editor-main",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_EditorHeader_js__WEBPACK_IMPORTED_MODULE_1__["default"], {
          pageTitle: pageTitle,
          overviewUrl: overviewUrl,
          viewUrl: !isNew && viewUrl ? viewUrl : '',
          saveStatus: saveStatus,
          onSave: handleSave
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
          className: "cns-map-editor__body",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_TabBar_js__WEBPACK_IMPORTED_MODULE_2__["default"], {
            activeTab: activeTab,
            isMaster: settings.isMaster,
            onChange: handleTabChange
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
            className: "cns-map-editor__content",
            children: [activeTab === 'settings' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_panels_SettingsPanel_js__WEBPACK_IMPORTED_MODULE_4__["default"], {
              settings: settings,
              onChange: setSettings
            }), activeTab === 'objects' && !settings.isMaster && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_panels_ObjectsPanel_js__WEBPACK_IMPORTED_MODULE_5__["default"], {
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
              onRepositionStart: id => setRepositioningObjId(id),
              onRepositionComplete: () => setRepositioningObjId(null),
              onDelete: handleObjectDeleteById
            }), activeTab === 'areas' && !settings.isMaster && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_panels_AreasPanel_js__WEBPACK_IMPORTED_MODULE_6__["default"], {
              mapId: mapId,
              settings: settings,
              areas: areasList,
              selectedAreaId: selectedAreaId,
              onAreasLoaded: setAreasList,
              onSelect: setSelectedAreaId,
              onDeselect: () => setSelectedAreaId(null),
              onNodesUpdate: handleAreaNodesUpdate,
              onDelete: handleAreaDeleteById
            }), (activeTab === 'hierarchy' || settings.isMaster && activeTab !== 'settings' && activeTab !== 'preview') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_panels_HierarchyPanel_js__WEBPACK_IMPORTED_MODULE_7__["default"], {}), activeTab === 'preview' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_panels_PreviewPanel_js__WEBPACK_IMPORTED_MODULE_8__["default"], {
              settings: settings,
              objects: objectsList,
              areas: areasList,
              viewUrl: !isNew && viewUrl ? viewUrl : ''
            })]
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_ContextPanel_js__WEBPACK_IMPORTED_MODULE_3__["default"], {
        activeTab: activeTab,
        selectedObject: selectedObject,
        selectedArea: selectedArea,
        onObjectSave: handleObjectSave,
        onObjectDelete: () => handleObjectDeleteById(selectedObjectId),
        onObjectClose: () => setSelectedObjectId(null),
        onObjectReposition: () => setRepositioningObjId(selectedObjectId),
        onAreaSave: handleAreaSave,
        onAreaDelete: () => handleAreaDeleteById(selectedAreaId),
        onAreaClose: () => setSelectedAreaId(null),
        onAreaNodesUpdate: handleAreaNodesUpdate,
        onAreaShapeTypeChange: handleAreaShapeTypeChange
      })]
    })
  });
}

/***/ },

/***/ "./src/admin/app/ObjectModal.js"
/*!**************************************!*\
  !*** ./src/admin/app/ObjectModal.js ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ObjectModal)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _forms_ObjectForm_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./forms/ObjectForm.js */ "./src/admin/app/forms/ObjectForm.js");
/* harmony import */ var _shared_SaveStatus_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shared/SaveStatus.js */ "./src/admin/app/shared/SaveStatus.js");
/* harmony import */ var _icons_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../icons.js */ "./src/admin/icons.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





function ObjectModal({
  obj,
  defaultX,
  defaultY,
  onSave,
  onClose
}) {
  const [formData, setFormData] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(() => (0,_forms_ObjectForm_js__WEBPACK_IMPORTED_MODULE_1__.defaultObjectFormData)(obj, defaultX, defaultY));
  const [icons, setIcons] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(_icons_js__WEBPACK_IMPORTED_MODULE_3__.iconLibraryCache || []);
  const [status, setStatus] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({
    text: '',
    type: ''
  });
  const [saving, setSaving] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);

  // Reset form when the target object changes
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setFormData((0,_forms_ObjectForm_js__WEBPACK_IMPORTED_MODULE_1__.defaultObjectFormData)(obj, defaultX, defaultY));
    setStatus({
      text: '',
      type: ''
    });
  }, [obj?.id]);

  // Ensure icon cache is loaded
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!_icons_js__WEBPACK_IMPORTED_MODULE_3__.iconLibraryCache) {
      (0,_icons_js__WEBPACK_IMPORTED_MODULE_3__.loadIconLibraryIntoCache)().then(() => setIcons(_icons_js__WEBPACK_IMPORTED_MODULE_3__.iconLibraryCache || []));
    }
  }, []);
  async function handleSave() {
    setSaving(true);
    setStatus({
      text: 'Saving…',
      type: ''
    });
    try {
      await onSave((0,_forms_ObjectForm_js__WEBPACK_IMPORTED_MODULE_1__.collectObjectPayload)(formData));
      setStatus({
        text: 'Saved.',
        type: 'ok'
      });
    } catch (err) {
      setStatus({
        text: err.message,
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
    className: "cns-modal",
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "cns-object-modal-title",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "cns-modal__backdrop",
      onClick: onClose
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "cns-modal__dialog",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "cns-modal__header",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h2", {
          className: "cns-modal__title",
          id: "cns-object-modal-title",
          children: obj ? 'Edit Object' : 'Add Object'
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
          type: "button",
          className: "cns-modal__close",
          "aria-label": "Close",
          onClick: onClose,
          children: "\xD7"
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "cns-modal__body",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_forms_ObjectForm_js__WEBPACK_IMPORTED_MODULE_1__["default"], {
          formData: formData,
          onChange: setFormData,
          icons: icons
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "cns-modal__footer",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_shared_SaveStatus_js__WEBPACK_IMPORTED_MODULE_2__["default"], {
          text: status.text,
          type: status.type
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
          type: "button",
          className: "button button-primary",
          disabled: saving,
          onClick: handleSave,
          children: obj ? 'Save Object' : 'Add Object'
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
          type: "button",
          className: "button",
          onClick: onClose,
          children: "Cancel"
        })]
      })]
    })]
  });
}

/***/ },

/***/ "./src/admin/app/TabBar.js"
/*!*********************************!*\
  !*** ./src/admin/app/TabBar.js ***!
  \*********************************/
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
  id: 'hierarchy',
  label: 'Hierarchy',
  masterHide: false,
  masterShow: true
}, {
  id: 'preview',
  label: 'Preview',
  masterHide: false,
  masterShow: false
}];
function TabBar({
  activeTab,
  isMaster,
  onChange
}) {
  const visible = TABS.filter(t => {
    if (t.masterHide && isMaster) return false;
    if (t.masterShow && !isMaster) return false;
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

/***/ "./src/admin/app/canvases/AreasCanvas.js"
/*!***********************************************!*\
  !*** ./src/admin/app/canvases/AreasCanvas.js ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AreasCanvas)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _areas_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../areas.js */ "./src/admin/areas.js");
/* harmony import */ var _canvas_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../canvas.js */ "./src/admin/canvas.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




function commitNodePosition(canvas, area, idx, x, y) {
  const W = canvas.width;
  const H = canvas.height;
  const st = area.shape_type || 'POLYGON';
  const newX = x / W;
  const newY = y / H;
  let updated = area.nodes.map(n => ({
    ...n
  }));
  if (st === 'RECTANGLE') {
    updated = (0,_areas_js__WEBPACK_IMPORTED_MODULE_1__.applyRectangleConstraint)(updated, idx, newX, newY) || updated;
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

/**
 * Props:
 *   drawState        — canvas draw state from settings
 *   areas            — current areas array
 *   selectedAreaId   — null or number
 *   onSelect         — fn(id)
 *   onDeselect       — fn()
 *   onNodesChange    — fn(areaId, newNodes)
 */
function AreasCanvas({
  drawState,
  areas,
  selectedAreaId,
  onSelect,
  onDeselect,
  onNodesChange
}) {
  const canvasRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const [repoNodeIdx, setRepoNodeIdx] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [repoCursor, setRepoCursor] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);

  // stateRef keeps current values for the document keydown handler (avoids stale closures).
  const stateRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)({});
  stateRef.current = {
    areas,
    selectedAreaId,
    onNodesChange,
    repoNodeIdx,
    repoCursor
  };

  // ── Draw ────────────────────────────────────────────────────────────────────

  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    (0,_areas_js__WEBPACK_IMPORTED_MODULE_1__.drawAreasOnCanvas)(canvas, drawState, areas, selectedAreaId, repoNodeIdx, repoCursor);
  });

  // ── JSX event handlers — always read current props/state, no stale closures ──

  function handleMouseMove(e) {
    if (repoNodeIdx === null) return;
    setRepoCursor((0,_canvas_js__WEBPACK_IMPORTED_MODULE_2__.getCanvasCoords)(canvasRef.current, e));
  }
  function handleClick(e) {
    const canvas = canvasRef.current;
    const {
      x,
      y
    } = (0,_canvas_js__WEBPACK_IMPORTED_MODULE_2__.getCanvasCoords)(canvas, e);
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
      const nIdx = (0,_areas_js__WEBPACK_IMPORTED_MODULE_1__.findNodeAtPoint)(ctx, x, y, selArea.nodes || [], W, H);
      if (nIdx !== -1) {
        setRepoNodeIdx(nIdx);
        setRepoCursor({
          x,
          y
        });
        return;
      }
    }
    const hitArea = (0,_areas_js__WEBPACK_IMPORTED_MODULE_1__.findAreaAtPoint)(ctx, x, y, areas, W, H);
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
      const areasActive = document.querySelector('[data-panel="areas"].cns-tab-panel--active');
      if (!areasActive) return;
      const {
        areas: areaList,
        selectedAreaId: selId,
        onNodesChange: onChange,
        repoNodeIdx: nodeIdx,
        repoCursor: cursor
      } = stateRef.current;
      if (e.key === 'Enter' && nodeIdx !== null && cursor) {
        const area = areaList.find(a => a.id === selId);
        if (area) {
          onChange?.(selId, commitNodePosition(canvasRef.current, area, nodeIdx, cursor.x, cursor.y));
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
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("canvas", {
      ref: canvasRef,
      onClick: handleClick,
      onMouseMove: handleMouseMove
    })
  });
}

/***/ },

/***/ "./src/admin/app/canvases/ObjectsCanvas.js"
/*!*************************************************!*\
  !*** ./src/admin/app/canvases/ObjectsCanvas.js ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ObjectsCanvas)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _objects_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../objects.js */ "./src/admin/objects.js");
/* harmony import */ var _canvas_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../canvas.js */ "./src/admin/canvas.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




/**
 * Props:
 *   drawState         — { width, aspectRatio, bgType, bgColor, bgImageUrl, imgUrl, imageX, imageY, imageW }
 *   objects           — current object list
 *   selectedObjectId  — null or number
 *   repositioningObjectId — null or number (set from outside via "Reposition" btn)
 *   onSelect          — fn(id)
 *   onDeselect        — fn()
 *   onPositionUpdate  — fn(id, x, y) after a move
 *   onRepositionComplete — fn()
 */

function ObjectsCanvas({
  drawState,
  objects,
  selectedObjectId,
  repositioningObjectId,
  onSelect,
  onDeselect,
  onPositionUpdate,
  onRepositionComplete
}) {
  const canvasRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  // Keep a ref for values that canvas event handlers need (avoids stale closures).
  const stateRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)({});
  stateRef.current = {
    objects,
    selectedObjectId,
    repositioningObjectId
  };

  // Local canvas-interaction state (not in React state — canvas redraws handle it)
  const repoLocalRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    cursor: null
  });

  // ── Draw ────────────────────────────────────────────────────────────────────

  function redraw(repoId, repoCursor) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const {
      objects: objs
    } = stateRef.current;
    (0,_objects_js__WEBPACK_IMPORTED_MODULE_1__.drawObjectsOnCanvas)(canvas, drawState, objs, stateRef.current.selectedObjectId, repoId, repoCursor);
  }
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    redraw(repositioningObjectId, repoLocalRef.current.cursor);
  }); // run after every render — lightweight since drawMapCanvas caches images

  // ── Events ──────────────────────────────────────────────────────────────────

  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    function onMouseMove(e) {
      const {
        repositioningObjectId: repoId
      } = stateRef.current;
      if (!repoId) return;
      repoLocalRef.current.cursor = (0,_canvas_js__WEBPACK_IMPORTED_MODULE_2__.getCanvasCoords)(canvas, e);
      redraw(repoId, repoLocalRef.current.cursor);
    }
    async function onClick(e) {
      const coords = (0,_canvas_js__WEBPACK_IMPORTED_MODULE_2__.getCanvasCoords)(canvas, e);
      const ctx = canvas.getContext('2d');
      const {
        objects: objs,
        selectedObjectId: selId,
        repositioningObjectId: repoId
      } = stateRef.current;
      if (repoId) {
        repoLocalRef.current.cursor = null;
        onRepositionComplete?.();
        await onPositionUpdate?.(repoId, coords.x, coords.y);
        return;
      }
      const hit = (0,_objects_js__WEBPACK_IMPORTED_MODULE_1__.findObjectAtPoint)(ctx, coords.x, coords.y, objs);
      if (hit) {
        onSelect?.(hit.id);
      } else if (selId) {
        await onPositionUpdate?.(selId, coords.x, coords.y);
      } else {
        onDeselect?.();
      }
    }
    function onKeyDown(e) {
      const {
        repositioningObjectId: repoId,
        selectedObjectId: selId
      } = stateRef.current;
      if (e.key === 'Escape') {
        if (repoId) {
          repoLocalRef.current.cursor = null;
          onRepositionComplete?.();
        } else if (selId) {
          onDeselect?.();
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
  }, []); // bind once; stateRef keeps values current

  const isRepositioning = !!repositioningObjectId;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    className: `cns-objects-canvas-wrap${isRepositioning ? ' cns-canvas--repositioning' : ''}`,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("canvas", {
      ref: canvasRef
    })
  });
}

/***/ },

/***/ "./src/admin/app/canvases/PreviewCanvas.js"
/*!*************************************************!*\
  !*** ./src/admin/app/canvases/PreviewCanvas.js ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PreviewCanvas)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _canvas_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../canvas.js */ "./src/admin/canvas.js");
/* harmony import */ var _objects_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../objects.js */ "./src/admin/objects.js");
/* harmony import */ var _areas_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../areas.js */ "./src/admin/areas.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





function PreviewCanvas({
  drawState,
  objects,
  areas
}) {
  const canvasRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    (0,_canvas_js__WEBPACK_IMPORTED_MODULE_1__.drawFullCanvas)(canvas, objects, areas, drawState, _areas_js__WEBPACK_IMPORTED_MODULE_3__.drawAreaShape, _objects_js__WEBPACK_IMPORTED_MODULE_2__.drawObjectMarker);
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
    className: "cns-canvas-wrap",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("canvas", {
      ref: canvasRef
    })
  });
}

/***/ },

/***/ "./src/admin/app/canvases/SettingsCanvas.js"
/*!**************************************************!*\
  !*** ./src/admin/app/canvases/SettingsCanvas.js ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SettingsCanvas)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _canvas_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../canvas.js */ "./src/admin/canvas.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



function SettingsCanvas({
  settings
}) {
  const canvasRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    (0,_canvas_js__WEBPACK_IMPORTED_MODULE_1__.drawMapCanvas)(canvas, {
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

/***/ "./src/admin/app/forms/AreaForm.js"
/*!*****************************************!*\
  !*** ./src/admin/app/forms/AreaForm.js ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AreaForm),
/* harmony export */   defaultAreaFormData: () => (/* binding */ defaultAreaFormData)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _shared_PostSearch_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/PostSearch.js */ "./src/admin/app/shared/PostSearch.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



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

/**
 * Controlled area metadata form.  Does NOT manage node data — that lives
 * in the area object in parent state and is edited via <NodeList />.
 *
 * Props: formData, onChange, onShapeTypeChange
 */
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
  const isPost = formData.infobox_source === 'post';
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("section", {
      className: "cns-modal-section",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h3", {
        children: "Details"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "cns-form-grid",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "cns-form-row cns-form-row--full",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
            children: "Title"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
            type: "text",
            className: "large-text",
            value: formData.title,
            onChange: e => set('title', e.target.value)
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "cns-form-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
            children: "Type"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("select", {
            value: formData.type,
            onChange: e => set('type', e.target.value),
            children: TYPES.map(t => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("option", {
              value: t.value,
              children: t.label
            }, t.value))
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "cns-form-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
            children: "Shape"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("select", {
            value: formData.shape_type,
            onChange: handleShapeChange,
            children: SHAPES.map(s => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("option", {
              value: s.value,
              children: s.label
            }, s.value))
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "cns-form-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
            children: "Object Time"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
            type: "number",
            className: "small-text",
            value: formData.object_time,
            onChange: e => set('object_time', parseInt(e.target.value, 10) || 0)
          })]
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("section", {
      className: "cns-modal-section",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h3", {
        children: "Infobox"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "cns-radio-toggle",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("label", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
            type: "radio",
            name: `area-ib-src-${n}`,
            value: "manual",
            checked: !isPost,
            onChange: () => set('infobox_source', 'manual')
          }), ' ', "Manual"]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("label", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
            type: "radio",
            name: `area-ib-src-${n}`,
            value: "post",
            checked: isPost,
            onChange: () => set('infobox_source', 'post')
          }), ' ', "From post"]
        })]
      }), !isPost && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "cns-form-grid",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "cns-form-row cns-form-row--full",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
            children: "Infobox Title"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
            type: "text",
            className: "large-text",
            value: formData.infobox_title,
            onChange: e => set('infobox_title', e.target.value)
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "cns-form-row cns-form-row--full",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
            children: "Description"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("textarea", {
            rows: "3",
            className: "large-text",
            value: formData.infobox_description,
            onChange: e => set('infobox_description', e.target.value)
          })]
        })]
      }), isPost && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_shared_PostSearch_js__WEBPACK_IMPORTED_MODULE_1__["default"], {
        linkedPostId: formData.linked_post_id,
        linkedPostLabel: formData.linked_post_label,
        onChange: item => onChange({
          ...formData,
          linked_post_id: item ? item.id : 0,
          linked_post_label: item ? item.title : ''
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("section", {
      className: "cns-modal-section",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h3", {
        children: "Design"
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
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
            className: "cns-range-wrap",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
              type: "range",
              min: "0",
              max: "1",
              step: "0.05",
              value: formData.style_fill_opacity,
              onChange: e => set('style_fill_opacity', parseFloat(e.target.value))
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("output", {
              className: "cns-range-value",
              children: parseFloat(formData.style_fill_opacity).toFixed(2)
            })]
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
function defaultAreaFormData(area) {
  const styles = area?.canvas_styles || {};
  return {
    title: area?.title || '',
    type: area?.type || 'GEOGRAPHY',
    shape_type: area?.shape_type || 'POLYGON',
    object_time: area?.object_time ?? 0,
    infobox_source: area?.infobox_source || 'manual',
    infobox_title: area?.infobox_data?.title || '',
    infobox_description: area?.infobox_data?.description || '',
    linked_post_id: area?.linked_post_id || 0,
    linked_post_label: area?.linked_post_id ? `Post ID: ${area.linked_post_id}` : '',
    style_fill: styles.fill || '#2271b1',
    style_fill_opacity: styles.fillOpacity ?? 0.3,
    style_stroke: styles.stroke || '#2271b1',
    style_stroke_width: styles.strokeWidth || 2
  };
}

/***/ },

/***/ "./src/admin/app/forms/NodeList.js"
/*!*****************************************!*\
  !*** ./src/admin/app/forms/NodeList.js ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NodeList)
/* harmony export */ });
/* harmony import */ var _areas_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../areas.js */ "./src/admin/areas.js");
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
      updated = (0,_areas_js__WEBPACK_IMPORTED_MODULE_0__.applyRectangleConstraint)(updated, idx, newX, newY) || updated;
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

/***/ "./src/admin/app/forms/ObjectForm.js"
/*!*******************************************!*\
  !*** ./src/admin/app/forms/ObjectForm.js ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   collectObjectPayload: () => (/* binding */ collectObjectPayload),
/* harmony export */   "default": () => (/* binding */ ObjectForm),
/* harmony export */   defaultObjectFormData: () => (/* binding */ defaultObjectFormData)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _shared_MediaPicker_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/MediaPicker.js */ "./src/admin/app/shared/MediaPicker.js");
/* harmony import */ var _shared_PostSearch_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/PostSearch.js */ "./src/admin/app/shared/PostSearch.js");
/* harmony import */ var _shared_IconPicker_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shared/IconPicker.js */ "./src/admin/app/shared/IconPicker.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/* global wp */





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

/**
 * Controlled object metadata form.
 *
 * Props: formData, onChange, icons (array from icon library cache)
 */
function ObjectForm({
  formData,
  onChange,
  icons
}) {
  // radio-name uniqueness is handled by rendering context (modal vs context panel)
  // so we use a stable prefix per mount via useRef
  const uid = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(Math.random().toString(36).slice(2));
  const n = uid.current;
  function set(key, val) {
    onChange({
      ...formData,
      [key]: val
    });
  }
  const isSvgSource = formData.icon_source !== 'image';
  const isManualIb = formData.infobox_source !== 'post';
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("section", {
      className: "cns-modal-section",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h3", {
        children: "Icon"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "cns-radio-toggle",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("label", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
            type: "radio",
            name: `obj-icon-src-${n}`,
            value: "svg",
            checked: isSvgSource,
            onChange: () => set('icon_source', 'svg')
          }), ' ', "From library"]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("label", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
            type: "radio",
            name: `obj-icon-src-${n}`,
            value: "image",
            checked: !isSvgSource,
            onChange: () => set('icon_source', 'image')
          }), ' ', "Custom image"]
        })]
      }), isSvgSource && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_shared_IconPicker_js__WEBPACK_IMPORTED_MODULE_3__["default"], {
          icons: icons,
          selectedIconId: formData.icon_image_id_svg,
          onSelect: id => set('icon_image_id_svg', id)
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
          className: "description",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("a", {
            href: window.cnsMapSuite?.iconsUrl || '#',
            target: "_blank",
            rel: "noreferrer",
            children: "Manage icon library \u2192"
          })
        })]
      }), !isSvgSource && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_shared_MediaPicker_js__WEBPACK_IMPORTED_MODULE_1__["default"], {
        imageId: formData.icon_image_id_custom,
        imageUrl: formData.icon_image_url,
        title: "Select Icon Image",
        onChange: att => onChange({
          ...formData,
          icon_image_id_custom: att ? att.id : 0,
          icon_image_url: att ? att.url : ''
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("section", {
      className: "cns-modal-section",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h3", {
        children: "Details"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "cns-form-grid",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "cns-form-row cns-form-row--full",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("label", {
            children: "Title"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
            type: "text",
            className: "large-text",
            value: formData.title,
            onChange: e => set('title', e.target.value)
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "cns-form-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("label", {
            children: "Type"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("select", {
            value: formData.type,
            onChange: e => set('type', e.target.value),
            children: TYPES.map(t => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("option", {
              value: t.value,
              children: t.label
            }, t.value))
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "cns-form-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("label", {
            children: "Object Time"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
            type: "number",
            className: "small-text",
            value: formData.object_time,
            onChange: e => set('object_time', parseInt(e.target.value, 10) || 0)
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "cns-form-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("label", {
            children: "X (px)"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
            type: "number",
            className: "small-text",
            value: formData.x,
            onChange: e => set('x', parseInt(e.target.value, 10) || 0)
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "cns-form-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("label", {
            children: "Y (px)"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
            type: "number",
            className: "small-text",
            value: formData.y,
            onChange: e => set('y', parseInt(e.target.value, 10) || 0)
          })]
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("section", {
      className: "cns-modal-section",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h3", {
        children: "Infobox"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "cns-radio-toggle",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("label", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
            type: "radio",
            name: `obj-infobox-src-${n}`,
            value: "manual",
            checked: isManualIb,
            onChange: () => set('infobox_source', 'manual')
          }), ' ', "Manual"]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("label", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
            type: "radio",
            name: `obj-infobox-src-${n}`,
            value: "post",
            checked: !isManualIb,
            onChange: () => set('infobox_source', 'post')
          }), ' ', "From post"]
        })]
      }), isManualIb && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "cns-form-grid",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "cns-form-row cns-form-row--full",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("label", {
            children: "Infobox Title"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
            type: "text",
            className: "large-text",
            value: formData.infobox_title,
            onChange: e => set('infobox_title', e.target.value)
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "cns-form-row cns-form-row--full",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("label", {
            children: "Description"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("textarea", {
            rows: "4",
            className: "large-text",
            value: formData.infobox_description,
            onChange: e => set('infobox_description', e.target.value)
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "cns-form-row cns-form-row--full",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("label", {
            children: "Infobox Image"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_shared_MediaPicker_js__WEBPACK_IMPORTED_MODULE_1__["default"], {
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
      }), !isManualIb && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_shared_PostSearch_js__WEBPACK_IMPORTED_MODULE_2__["default"], {
        linkedPostId: formData.linked_post_id,
        linkedPostLabel: formData.linked_post_label,
        onChange: item => onChange({
          ...formData,
          linked_post_id: item ? item.id : 0,
          linked_post_label: item ? item.title : ''
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("section", {
      className: "cns-modal-section",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h3", {
        children: "Design"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "cns-form-grid",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "cns-form-row cns-form-row--full",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("label", {
            children: "Icon Size (px)"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "cns-range-wrap",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
              type: "range",
              min: "8",
              max: "128",
              step: "1",
              value: formData.style_size,
              onChange: e => set('style_size', parseInt(e.target.value, 10))
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("output", {
              className: "cns-range-value",
              children: formData.style_size
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "cns-form-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("label", {
            children: "Fill Color"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
            type: "color",
            value: formData.style_fill,
            onChange: e => set('style_fill', e.target.value)
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "cns-form-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("label", {
            children: "Stroke Color"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
            type: "color",
            value: formData.style_stroke,
            onChange: e => set('style_stroke', e.target.value)
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
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
    infobox_source: obj?.infobox_source || 'manual',
    infobox_title: obj?.infobox_data?.title || '',
    infobox_description: obj?.infobox_data?.description || '',
    infobox_image_id: obj?.infobox_data?.image_id || 0,
    infobox_image_url: '',
    linked_post_id: obj?.linked_post_id || 0,
    linked_post_label: obj?.linked_post_id ? `Post ID: ${obj.linked_post_id}` : '',
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

/***/ "./src/admin/app/lists/AreasList.js"
/*!******************************************!*\
  !*** ./src/admin/app/lists/AreasList.js ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AreasList)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

function AreasList({
  areas,
  onSelect,
  onDelete
}) {
  if (!areas.length) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
      className: "cns-objects-empty",
      children: "No areas yet. Click \"Add Area\" to create one."
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("table", {
    className: "widefat cns-objects-table",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("thead", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("tr", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("th", {
          children: "Title"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("th", {
          children: "Type"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("th", {
          children: "Nodes"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("th", {
          children: "Actions"
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("tbody", {
      children: areas.map(area => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("tr", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("td", {
          children: area.title || '(no title)'
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("td", {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
            className: "cns-badge cns-badge--type",
            children: area.type
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("td", {
          children: [(area.nodes || []).length, " nodes"]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("td", {
          className: "cns-maps-actions",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
            className: "button button-small",
            onClick: () => onSelect(area.id),
            children: "Select"
          }), ' ', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
            className: "button button-small",
            onClick: () => onDelete(area.id),
            children: "Delete"
          })]
        })]
      }, area.id))
    })]
  });
}

/***/ },

/***/ "./src/admin/app/lists/ObjectsList.js"
/*!********************************************!*\
  !*** ./src/admin/app/lists/ObjectsList.js ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ObjectsList)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

function ObjectsList({
  objects,
  onEdit,
  onDelete
}) {
  if (!objects.length) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
      className: "cns-objects-empty",
      children: "No objects yet. Click on the canvas to place one."
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("table", {
    className: "widefat cns-objects-table",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("thead", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("tr", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("th", {
          style: {
            width: 36
          }
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("th", {
          children: "Title"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("th", {
          children: "Type"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("th", {
          children: "Position"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("th", {
          children: "Actions"
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("tbody", {
      children: objects.map(obj => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("tr", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("td", {
          className: "col-icon",
          children: obj.icon_url ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("img", {
            src: obj.icon_url,
            width: "28",
            height: "28",
            alt: "",
            style: {
              display: 'block',
              objectFit: 'contain'
            }
          }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
            className: "cns-obj-dot",
            style: {
              background: obj.canvas_styles?.fillStyle || '#2271b1'
            }
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("td", {
          children: obj.title || '(no title)'
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("td", {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
            className: "cns-badge cns-badge--type",
            children: obj.type
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("td", {
          children: [obj.x, ", ", obj.y]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("td", {
          className: "cns-maps-actions",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
            className: "button button-small",
            onClick: () => onEdit(obj),
            children: "Edit"
          }), ' ', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
            className: "button button-small",
            onClick: () => onDelete(obj.id),
            children: "Delete"
          })]
        })]
      }, obj.id))
    })]
  });
}

/***/ },

/***/ "./src/admin/app/panels/AreasPanel.js"
/*!********************************************!*\
  !*** ./src/admin/app/panels/AreasPanel.js ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AreasPanel)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _canvases_AreasCanvas_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../canvases/AreasCanvas.js */ "./src/admin/app/canvases/AreasCanvas.js");
/* harmony import */ var _lists_AreasList_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lists/AreasList.js */ "./src/admin/app/lists/AreasList.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils.js */ "./src/admin/utils.js");
/* harmony import */ var _canvas_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../canvas.js */ "./src/admin/canvas.js");
/* harmony import */ var _areas_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../areas.js */ "./src/admin/areas.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);







function AreasPanel({
  mapId,
  settings,
  areas,
  selectedAreaId,
  onAreasLoaded,
  onSelect,
  onDeselect,
  onNodesUpdate,
  onDelete
}) {
  const [initialized, setInitialized] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (initialized || !mapId) return;
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.apiFetch)('GET', `/maps/${mapId}/areas`).then(r => r.json()).then(data => {
      if (Array.isArray(data)) onAreasLoaded(data);
    }).catch(() => {}).finally(() => setInitialized(true));
  }, [mapId]);
  async function handleAddArea() {
    if (!mapId) return;
    const defaultNodes = (0,_areas_js__WEBPACK_IMPORTED_MODULE_5__.getDefaultNodes)('POLYGON');
    try {
      const res = await (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.apiFetch)('POST', `/maps/${mapId}/areas`, {
        title: 'New Area',
        nodes: JSON.stringify(defaultNodes),
        style_fill: '#2271b1',
        style_fill_opacity: 0.3,
        style_stroke: '#2271b1',
        style_stroke_width: 2
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create area.');
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
  const drawState = (0,_canvas_js__WEBPACK_IMPORTED_MODULE_4__.settingsToDrawState)(settings);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
    className: "cns-tab-panel cns-tab-panel--active",
    "data-panel": "areas",
    role: "tabpanel",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      className: "cns-objects-layout",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "cns-objects-toolbar",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("button", {
          type: "button",
          className: "button button-primary",
          onClick: handleAddArea,
          children: "Add Area"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
          className: "description",
          children: "Click a node to reposition it. Click empty space on a selected area to add a node."
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_canvases_AreasCanvas_js__WEBPACK_IMPORTED_MODULE_1__["default"], {
        drawState: drawState,
        areas: areas,
        selectedAreaId: selectedAreaId,
        onSelect: onSelect,
        onDeselect: onDeselect,
        onNodesChange: onNodesUpdate
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_lists_AreasList_js__WEBPACK_IMPORTED_MODULE_2__["default"], {
        areas: areas,
        onSelect: onSelect,
        onDelete: handleDelete
      })]
    })
  });
}

/***/ },

/***/ "./src/admin/app/panels/HierarchyPanel.js"
/*!************************************************!*\
  !*** ./src/admin/app/panels/HierarchyPanel.js ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HierarchyPanel)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

function HierarchyPanel() {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
    className: "cns-tab-panel cns-tab-panel--active",
    "data-panel": "hierarchy",
    role: "tabpanel",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
      className: "cns-placeholder",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
        className: "dashicons dashicons-networking cns-placeholder__icon"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", {
        children: "Map Hierarchy"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
        children: "Define regions on this MasterMap that link to child maps. Hovering a region shows the child map's thumbnail and excerpt; clicking navigates to it."
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
        className: "cns-placeholder__tag",
        children: "\u2014 Coming soon \u2014"
      })]
    })
  });
}

/***/ },

/***/ "./src/admin/app/panels/ObjectsPanel.js"
/*!**********************************************!*\
  !*** ./src/admin/app/panels/ObjectsPanel.js ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ObjectsPanel)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _canvases_ObjectsCanvas_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../canvases/ObjectsCanvas.js */ "./src/admin/app/canvases/ObjectsCanvas.js");
/* harmony import */ var _lists_ObjectsList_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lists/ObjectsList.js */ "./src/admin/app/lists/ObjectsList.js");
/* harmony import */ var _ObjectModal_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../ObjectModal.js */ "./src/admin/app/ObjectModal.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../utils.js */ "./src/admin/utils.js");
/* harmony import */ var _canvas_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../canvas.js */ "./src/admin/canvas.js");
/* harmony import */ var _forms_ObjectForm_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../forms/ObjectForm.js */ "./src/admin/app/forms/ObjectForm.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);








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
  onRepositionStart,
  onRepositionComplete,
  onDelete
}) {
  const [initialized, setInitialized] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [modal, setModal] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null); // null | { obj, x, y }

  // Load objects once when the tab mounts
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (initialized || !mapId) return;
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.apiFetch)('GET', `/maps/${mapId}/objects`).then(r => r.json()).then(data => {
      if (Array.isArray(data)) onObjectsLoaded(data);
    }).catch(() => {}).finally(() => setInitialized(true));
  }, [mapId]);
  function openAddModal() {
    const cx = Math.round(settings.width / 2);
    const cy = Math.round(settings.width / settings.aspectRatio / 2);
    setModal({
      obj: null,
      x: cx,
      y: cy
    });
  }
  async function handleModalSave(formPayload) {
    if (modal.obj) {
      // edit from list
      const res = await (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.apiFetch)('POST', `/objects/${modal.obj.id}`, formPayload);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Save failed.');
      onObjectsLoaded(objects.map(o => o.id === modal.obj.id ? data : o));
    } else {
      const newObj = await onAdd(formPayload);
      onSelect(newObj.id);
    }
    setModal(null);
  }
  async function handleDelete(id) {
    if (!confirm('Delete this object?')) return;
    await onDelete(id);
  }
  const drawState = (0,_canvas_js__WEBPACK_IMPORTED_MODULE_5__.settingsToDrawState)(settings);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    className: "cns-tab-panel cns-tab-panel--active",
    "data-panel": "objects",
    role: "tabpanel",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      className: "cns-objects-layout",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "cns-objects-toolbar",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
          type: "button",
          className: "button button-primary",
          onClick: openAddModal,
          children: "Add Object"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
          className: "description",
          children: "Or click directly on the canvas to place an object at that position."
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_canvases_ObjectsCanvas_js__WEBPACK_IMPORTED_MODULE_1__["default"], {
        drawState: drawState,
        objects: objects,
        selectedObjectId: selectedObjectId,
        repositioningObjectId: repositioningObjectId,
        onSelect: onSelect,
        onDeselect: onDeselect,
        onPositionUpdate: onPositionUpdate,
        onRepositionComplete: onRepositionComplete
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_lists_ObjectsList_js__WEBPACK_IMPORTED_MODULE_2__["default"], {
        objects: objects,
        onEdit: obj => setModal({
          obj,
          x: null,
          y: null
        }),
        onDelete: handleDelete
      })]
    }), modal && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_ObjectModal_js__WEBPACK_IMPORTED_MODULE_3__["default"], {
      obj: modal.obj,
      defaultX: modal.x,
      defaultY: modal.y,
      onSave: handleModalSave,
      onClose: () => setModal(null)
    })]
  });
}

/***/ },

/***/ "./src/admin/app/panels/PreviewPanel.js"
/*!**********************************************!*\
  !*** ./src/admin/app/panels/PreviewPanel.js ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PreviewPanel)
/* harmony export */ });
/* harmony import */ var _canvases_PreviewCanvas_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../canvases/PreviewCanvas.js */ "./src/admin/app/canvases/PreviewCanvas.js");
/* harmony import */ var _canvas_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../canvas.js */ "./src/admin/canvas.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



function PreviewPanel({
  settings,
  objects,
  areas,
  viewUrl
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: "cns-tab-panel cns-tab-panel--active",
    "data-panel": "preview",
    role: "tabpanel",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_canvases_PreviewCanvas_js__WEBPACK_IMPORTED_MODULE_0__["default"], {
      drawState: (0,_canvas_js__WEBPACK_IMPORTED_MODULE_1__.settingsToDrawState)(settings),
      objects: objects,
      areas: areas
    }), viewUrl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "cns-preview-actions",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("a", {
        href: viewUrl,
        className: "button",
        target: "_blank",
        rel: "noopener noreferrer",
        children: "View map page"
      })
    })]
  });
}

/***/ },

/***/ "./src/admin/app/panels/SettingsPanel.js"
/*!***********************************************!*\
  !*** ./src/admin/app/panels/SettingsPanel.js ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SettingsPanel)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _shared_MediaPicker_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/MediaPicker.js */ "./src/admin/app/shared/MediaPicker.js");
/* harmony import */ var _canvases_SettingsCanvas_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../canvases/SettingsCanvas.js */ "./src/admin/app/canvases/SettingsCanvas.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/* global wp */




/**
 * Props: settings, onChange(patchFn)
 */

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
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    className: "cns-tab-panel cns-tab-panel--active",
    "data-panel": "settings",
    role: "tabpanel",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "cns-settings-layout",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "cns-settings-form",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "cns-form-grid",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "cns-form-row cns-form-row--full",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
              htmlFor: "cns-map-title",
              children: "Map Title"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
              id: "cns-map-title",
              type: "text",
              className: "large-text",
              value: settings.title,
              placeholder: "Enter map title\u2026",
              onChange: e => set('title', e.target.value)
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "cns-form-row",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
              htmlFor: "cns-map-width",
              children: "Max Width (px)"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
              id: "cns-map-width",
              type: "number",
              className: "small-text",
              min: "100",
              step: "10",
              value: settings.width,
              onChange: e => set('width', parseInt(e.target.value, 10) || 1000)
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "cns-form-row",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
              htmlFor: "cns-map-aspect-ratio",
              children: "Aspect Ratio"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
              className: "cns-range-wrap",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
                id: "cns-map-aspect-ratio",
                type: "range",
                min: "0.25",
                max: "4",
                step: "0.01",
                value: settings.aspectRatio,
                onChange: e => set('aspectRatio', parseFloat(e.target.value))
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("output", {
                className: "cns-range-value",
                children: settings.aspectRatio.toFixed(2)
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
              className: "description",
              children: "Width \xF7 Height (1.77 = 16:9, 1.0 = square, 0.75 = portrait)"
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "cns-form-row",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
              htmlFor: "cns-map-time",
              children: "Map Time"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
              id: "cns-map-time",
              type: "number",
              className: "small-text",
              value: settings.time,
              onChange: e => set('time', parseInt(e.target.value, 10) || 0)
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
              className: "description",
              children: "In-world timeline value."
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "cns-form-row cns-form-row--full",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
              children: "Base Map Image"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_shared_MediaPicker_js__WEBPACK_IMPORTED_MODULE_1__["default"], {
              imageId: settings.imageId,
              imageUrl: settings.imageUrl,
              title: "Select Base Map Image",
              onChange: att => onChange(prev => ({
                ...prev,
                imageId: att ? att.id : 0,
                imageUrl: att ? att.url : ''
              }))
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "cns-form-row",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
              htmlFor: "cns-map-image-x",
              children: "Image X offset"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
              className: "cns-range-wrap",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
                id: "cns-map-image-x",
                type: "range",
                min: "0",
                max: "1",
                step: "0.01",
                value: settings.imageX,
                onChange: e => set('imageX', parseFloat(e.target.value))
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("output", {
                className: "cns-range-value",
                children: settings.imageX.toFixed(2)
              })]
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "cns-form-row",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
              htmlFor: "cns-map-image-y",
              children: "Image Y offset"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
              className: "cns-range-wrap",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
                id: "cns-map-image-y",
                type: "range",
                min: "0",
                max: "1",
                step: "0.01",
                value: settings.imageY,
                onChange: e => set('imageY', parseFloat(e.target.value))
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("output", {
                className: "cns-range-value",
                children: settings.imageY.toFixed(2)
              })]
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "cns-form-row",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
              htmlFor: "cns-map-image-width",
              children: "Image Width"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
              className: "cns-range-wrap",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
                id: "cns-map-image-width",
                type: "range",
                min: "0.1",
                max: "2",
                step: "0.01",
                value: settings.imageW,
                onChange: e => set('imageW', parseFloat(e.target.value))
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("output", {
                className: "cns-range-value",
                children: settings.imageW.toFixed(2)
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
              className: "description",
              children: "1.0 = full canvas width. Height follows image ratio."
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "cns-form-row cns-form-row--full",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
              children: "Background"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
              className: "cns-bg-type-toggle",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("label", {
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
                  type: "radio",
                  name: "cns-map-bg-type",
                  value: "color",
                  checked: settings.bgType === 'color',
                  onChange: () => set('bgType', 'color')
                }), ' ', "Color"]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("label", {
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
                  type: "radio",
                  name: "cns-map-bg-type",
                  value: "image",
                  checked: settings.bgType === 'image',
                  onChange: () => set('bgType', 'image')
                }), ' ', "Image"]
              })]
            }), settings.bgType === 'color' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
              className: "cns-bg-section cns-bg-section--color",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
                type: "color",
                className: "cns-color-picker",
                value: settings.bgColor,
                onChange: e => set('bgColor', e.target.value)
              })
            }), settings.bgType === 'image' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
              className: "cns-bg-section cns-bg-section--image",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_shared_MediaPicker_js__WEBPACK_IMPORTED_MODULE_1__["default"], {
                imageId: settings.bgImageId,
                imageUrl: settings.bgImageUrl,
                title: "Select Background Image",
                onChange: att => onChange(prev => ({
                  ...prev,
                  bgImageId: att ? att.id : 0,
                  bgImageUrl: att ? att.url : ''
                }))
              })
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "cns-form-row",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("label", {
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
                type: "checkbox",
                checked: settings.isMaster,
                onChange: e => set('isMaster', e.target.checked)
              }), ' ', "MasterMap mode"]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
              className: "description",
              children: "Links to child maps instead of posts. Switches Objects/Areas tabs to Hierarchy."
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
            className: "cns-form-row",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("label", {
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
                type: "checkbox",
                checked: settings.featured,
                onChange: e => set('featured', e.target.checked)
              }), ' ', "Featured"]
            })
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_canvases_SettingsCanvas_js__WEBPACK_IMPORTED_MODULE_2__["default"], {
        settings: settings
      })]
    })
  });
}

/***/ },

/***/ "./src/admin/app/shared/IconPicker.js"
/*!********************************************!*\
  !*** ./src/admin/app/shared/IconPicker.js ***!
  \********************************************/
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
    const iconsUrl = window.cnsMapSuite?.iconsUrl || '#';
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
      className: "description",
      children: ["No icons yet.", ' ', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("a", {
        href: iconsUrl,
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

/***/ "./src/admin/app/shared/MediaPicker.js"
/*!*********************************************!*\
  !*** ./src/admin/app/shared/MediaPicker.js ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MediaPicker)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/* global wp */


/**
 * Wraps the WordPress media frame.
 *
 * Props:
 *   imageId    {number}   current attachment ID (0 = none)
 *   imageUrl   {string}   current preview URL
 *   title      {string}   media-frame title
 *   onChange   {fn}       called with { id, url } or null on remove
 */

function MediaPicker({
  imageId,
  imageUrl,
  title = 'Select Image',
  onChange
}) {
  const frameRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  function openPicker(e) {
    e.preventDefault();
    if (frameRef.current) {
      frameRef.current.open();
      return;
    }
    frameRef.current = wp.media({
      title,
      button: {
        text: 'Use this image'
      },
      multiple: false,
      library: {
        type: 'image'
      }
    });
    frameRef.current.on('select', () => {
      const att = frameRef.current.state().get('selection').first().toJSON();
      onChange?.({
        id: att.id,
        url: att.url
      });
    });
    frameRef.current.open();
  }
  function removePicker(e) {
    e.preventDefault();
    onChange?.(null);
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: "cns-image-picker",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "cns-image-picker__preview",
      children: imageUrl ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("img", {
        src: imageUrl,
        alt: ""
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
        children: "No image selected"
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
      type: "button",
      className: "button",
      onClick: openPicker,
      children: "Select Image"
    }), imageId > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
      type: "button",
      className: "button",
      onClick: removePicker,
      children: "Remove"
    })]
  });
}

/***/ },

/***/ "./src/admin/app/shared/PostSearch.js"
/*!********************************************!*\
  !*** ./src/admin/app/shared/PostSearch.js ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PostSearch)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


/**
 * Async post-search typeahead backed by the WP REST /search endpoint.
 *
 * Props:
 *   linkedPostId    {number}
 *   linkedPostLabel {string}   display label for the currently linked post
 *   onChange        {fn}       called with { id, title } or { id: 0, title: '' } on clear
 */

function PostSearch({
  linkedPostId,
  linkedPostLabel,
  onChange
}) {
  const [query, setQuery] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [results, setResults] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [open, setOpen] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const timer = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => () => clearTimeout(timer.current), []);
  function handleInput(e) {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(timer.current);
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

/***/ "./src/admin/app/shared/SaveStatus.js"
/*!********************************************!*\
  !*** ./src/admin/app/shared/SaveStatus.js ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SaveStatus)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

/* global wp */
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

/***/ "./src/admin/areas.js"
/*!****************************!*\
  !*** ./src/admin/areas.js ***!
  \****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyRectangleConstraint: () => (/* binding */ applyRectangleConstraint),
/* harmony export */   drawAreaShape: () => (/* binding */ drawAreaShape),
/* harmony export */   drawAreasOnCanvas: () => (/* binding */ drawAreasOnCanvas),
/* harmony export */   findAreaAtPoint: () => (/* binding */ findAreaAtPoint),
/* harmony export */   findNodeAtPoint: () => (/* binding */ findNodeAtPoint),
/* harmony export */   getDefaultNodes: () => (/* binding */ getDefaultNodes),
/* harmony export */   normalizeNodesForShapeType: () => (/* binding */ normalizeNodesForShapeType)
/* harmony export */ });
/* harmony import */ var _canvas_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./canvas.js */ "./src/admin/canvas.js");

const NODE_HALF = 5;

// ── Path builders ─────────────────────────────────────────────────────────────

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

// repoNodeIdx / repoCursor are only meaningful when isSelected === true.
function drawAreaShape(ctx, area, W, H, isSelected, repoNodeIdx, repoCursor) {
  const rawNodes = area.nodes || [];
  if (!rawNodes.length) return;
  const shapeType = area.shape_type || 'POLYGON';
  const liveNodes = isSelected ? getLiveNodes(rawNodes, shapeType, repoNodeIdx ?? null, repoCursor ?? null, W, H) : rawNodes;
  const minNodes = shapeType === 'CIRCLE' ? 2 : 3;
  if (liveNodes.length >= minNodes) {
    const styles = area.canvas_styles || {};
    const fill = styles.fill || '#2271b1';
    const fillOpacity = styles.fillOpacity ?? 0.3;
    const stroke = styles.stroke || '#2271b1';
    const strokeWidth = styles.strokeWidth || 2;
    buildAreaPathFromNodes(ctx, liveNodes, shapeType, W, H);
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
    ctx.beginPath();
    ctx.rect(node.x * W - NODE_HALF, node.y * H - NODE_HALF, NODE_HALF * 2, NODE_HALF * 2);
    ctx.strokeStyle = isRepoNode ? '#e75252' : '#2271b1';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}
async function drawAreasOnCanvas(canvas, drawState, areas, selectedAreaId, repoNodeIdx, repoCursor) {
  await (0,_canvas_js__WEBPACK_IMPORTED_MODULE_0__.drawMapCanvas)(canvas, drawState);
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  for (const area of areas) {
    const isSel = area.id === selectedAreaId;
    drawAreaShape(ctx, area, W, H, isSel, isSel ? repoNodeIdx : null, isSel ? repoCursor : null);
  }
}

// ── Hit detection ─────────────────────────────────────────────────────────────

function findNodeAtPoint(ctx, x, y, nodes, W, H) {
  for (let i = nodes.length - 1; i >= 0; i--) {
    ctx.beginPath();
    ctx.rect(nodes[i].x * W - NODE_HALF, nodes[i].y * H - NODE_HALF, NODE_HALF * 2, NODE_HALF * 2);
    if (ctx.isPointInPath(x, y)) return i;
  }
  return -1;
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

/***/ },

/***/ "./src/admin/canvas.js"
/*!*****************************!*\
  !*** ./src/admin/canvas.js ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   drawFullCanvas: () => (/* binding */ drawFullCanvas),
/* harmony export */   drawMapCanvas: () => (/* binding */ drawMapCanvas),
/* harmony export */   getCanvasCoords: () => (/* binding */ getCanvasCoords),
/* harmony export */   settingsToDrawState: () => (/* binding */ settingsToDrawState)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./src/admin/utils.js");


// state shape: { width, aspectRatio, bgType, bgColor, bgImageUrl, imgUrl, imageX, imageY, imageW }
async function drawMapCanvas(canvasEl, state) {
  const ctx = canvasEl.getContext('2d');
  const width = state.width;
  const height = Math.round(width / state.aspectRatio);
  canvasEl.width = width;
  canvasEl.height = height;
  ctx.clearRect(0, 0, width, height);
  if (state.bgType === 'image') {
    const bgImg = await (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.loadImage)(state.bgImageUrl);
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
  const mapImg = await (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.loadImage)(state.imgUrl);
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

// drawAreaShape / drawObjectMarker are passed in to avoid circular imports.
async function drawFullCanvas(canvas, objects, areas, state, drawAreaFn, drawObjectFn) {
  await drawMapCanvas(canvas, state);
  const ctx = canvas.getContext('2d');
  for (const area of areas) drawAreaFn(ctx, area, canvas.width, canvas.height, false, null, null);
  for (const obj of objects) await drawObjectFn(ctx, obj, false);
}

/***/ },

/***/ "./src/admin/icons.js"
/*!****************************!*\
  !*** ./src/admin/icons.js ***!
  \****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   iconLibraryCache: () => (/* binding */ iconLibraryCache),
/* harmony export */   loadIconLibraryIntoCache: () => (/* binding */ loadIconLibraryIntoCache)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./src/admin/utils.js");

let iconLibraryCache = null;
async function loadIconLibraryIntoCache() {
  try {
    const res = await (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.apiFetch)('GET', '/icons');
    const data = await res.json();
    if (res.ok) iconLibraryCache = data;
  } catch {
    iconLibraryCache = [];
  }
}

/***/ },

/***/ "./src/admin/objects.js"
/*!******************************!*\
  !*** ./src/admin/objects.js ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   drawObjectMarker: () => (/* binding */ drawObjectMarker),
/* harmony export */   drawObjectsOnCanvas: () => (/* binding */ drawObjectsOnCanvas),
/* harmony export */   findObjectAtPoint: () => (/* binding */ findObjectAtPoint)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./src/admin/utils.js");
/* harmony import */ var _canvas_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./canvas.js */ "./src/admin/canvas.js");



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
  const size = obj.canvas_styles?.size || 32;
  const fill = obj.canvas_styles?.fillStyle || '#ffffff';
  const stroke = obj.canvas_styles?.strokeStyle || '#2271b1';
  if (obj.icon_url) {
    const img = obj.icon_mime === 'image/svg+xml' ? await (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.loadSvgWithColors)(obj.icon_url, fill, stroke) : await (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.loadImage)(obj.icon_url);
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

// drawState: { width, aspectRatio, bgType, bgColor, bgImageUrl, imgUrl, imageX, imageY, imageW }
async function drawObjectsOnCanvas(canvas, drawState, objects, selectedObjectId, repositioningId, repositionCursor) {
  await (0,_canvas_js__WEBPACK_IMPORTED_MODULE_1__.drawMapCanvas)(canvas, drawState);
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
function findObjectAtPoint(ctx, x, y, objects) {
  for (let i = objects.length - 1; i >= 0; i--) {
    const obj = objects[i];
    const size = obj.canvas_styles?.size || 32;
    const half = size / 2;
    ctx.beginPath();
    ctx.rect(obj.x - half, obj.y - half, size, size);
    if (ctx.isPointInPath(x, y)) return obj;
  }
  return null;
}

/***/ },

/***/ "./src/admin/utils.js"
/*!****************************!*\
  !*** ./src/admin/utils.js ***!
  \****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   apiFetch: () => (/* binding */ apiFetch),
/* harmony export */   loadImage: () => (/* binding */ loadImage),
/* harmony export */   loadSvgWithColors: () => (/* binding */ loadSvgWithColors)
/* harmony export */ });
function apiFetch(method, path, body) {
  const opts = {
    method,
    headers: {
      'X-WP-Nonce': window.cnsMapSuite.nonce
    }
  };
  if (body) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  return fetch(window.cnsMapSuite.restUrl + path, opts);
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
  const key = `${url}|${fill || ''}|${stroke || ''}`;
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

/***/ "@wordpress/element"
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
(module) {

module.exports = window["wp"]["element"];

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
/*!****************************!*\
  !*** ./src/admin/index.js ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _app_MapEditorApp_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app/MapEditorApp.js */ "./src/admin/app/MapEditorApp.js");
/* harmony import */ var _app_IconLibraryApp_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/IconLibraryApp.js */ "./src/admin/app/IconLibraryApp.js");
/* harmony import */ var _admin_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./admin.scss */ "./src/admin/admin.scss");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





document.addEventListener('DOMContentLoaded', () => {
  const editorEl = document.getElementById('cns-admin-root');
  if (editorEl) (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createRoot)(editorEl).render(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_app_MapEditorApp_js__WEBPACK_IMPORTED_MODULE_1__["default"], {}));
  const iconsEl = document.getElementById('cns-icons-root');
  if (iconsEl) (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createRoot)(iconsEl).render(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_app_IconLibraryApp_js__WEBPACK_IMPORTED_MODULE_2__["default"], {}));
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map