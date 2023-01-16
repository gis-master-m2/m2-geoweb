var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

function getCjsExportFromNamespace (n) {
	return n && n['default'] || n;
}

var ColumnMeta_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
var ColumnMeta = (function () {
    function ColumnMeta(name, type, title, description, width, precision, scale, nullable, unique, primary_key) {
        this.name = name;
        this.type = type;
        this.title = title;
        this.description = description;
        this.width = width;
        this.precision = precision;
        this.scale = scale;
        this.nullable = nullable;
        this.unique = unique;
        this.primary_key = primary_key;
    }
    return ColumnMeta;
}());
exports.default = ColumnMeta;

});

unwrapExports(ColumnMeta_1);

/// @file
/// @addtogroup flatbuffers_javascript_api
/// @{
/// @cond FLATBUFFERS_INTERNAL

/**
 * @fileoverview
 *
 * Need to suppress 'global this' error so the Node.js export line doesn't cause
 * closure compile to error out.
 * @suppress {globalThis}
 */

/**
 * @const
 * @namespace
 */
var flatbuffers = {};

/**
 * @type {number}
 * @const
 */
flatbuffers.SIZEOF_SHORT = 2;

/**
 * @type {number}
 * @const
 */
flatbuffers.SIZEOF_INT = 4;

/**
 * @type {number}
 * @const
 */
flatbuffers.FILE_IDENTIFIER_LENGTH = 4;

/**
 * @type {number}
 * @const
 */
flatbuffers.SIZE_PREFIX_LENGTH = 4;

/**
 * @enum {number}
 */
flatbuffers.Encoding = {
  UTF8_BYTES: 1,
  UTF16_STRING: 2
};

/**
 * @type {Int32Array}
 * @const
 */
flatbuffers.int32 = new Int32Array(2);

/**
 * @type {Float32Array}
 * @const
 */
flatbuffers.float32 = new Float32Array(flatbuffers.int32.buffer);

/**
 * @type {Float64Array}
 * @const
 */
flatbuffers.float64 = new Float64Array(flatbuffers.int32.buffer);

/**
 * @type {boolean}
 * @const
 */
flatbuffers.isLittleEndian = new Uint16Array(new Uint8Array([1, 0]).buffer)[0] === 1;

////////////////////////////////////////////////////////////////////////////////

/**
 * @constructor
 * @param {number} low
 * @param {number} high
 */
flatbuffers.Long = function(low, high) {
  /**
   * @type {number}
   * @const
   */
  this.low = low | 0;

  /**
   * @type {number}
   * @const
   */
  this.high = high | 0;
};

/**
 * @param {number} low
 * @param {number} high
 * @returns {!flatbuffers.Long}
 */
flatbuffers.Long.create = function(low, high) {
  // Special-case zero to avoid GC overhead for default values
  return low == 0 && high == 0 ? flatbuffers.Long.ZERO : new flatbuffers.Long(low, high);
};

/**
 * @returns {number}
 */
flatbuffers.Long.prototype.toFloat64 = function() {
  return (this.low >>> 0) + this.high * 0x100000000;
};

/**
 * @param {flatbuffers.Long} other
 * @returns {boolean}
 */
flatbuffers.Long.prototype.equals = function(other) {
  return this.low == other.low && this.high == other.high;
};

/**
 * @type {!flatbuffers.Long}
 * @const
 */
flatbuffers.Long.ZERO = new flatbuffers.Long(0, 0);

/// @endcond
////////////////////////////////////////////////////////////////////////////////
/**
 * Create a FlatBufferBuilder.
 *
 * @constructor
 * @param {number=} opt_initial_size
 */
flatbuffers.Builder = function(opt_initial_size) {
  if (!opt_initial_size) {
    var initial_size = 1024;
  } else {
    var initial_size = opt_initial_size;
  }

  /**
   * @type {flatbuffers.ByteBuffer}
   * @private
   */
  this.bb = flatbuffers.ByteBuffer.allocate(initial_size);

  /**
   * Remaining space in the ByteBuffer.
   *
   * @type {number}
   * @private
   */
  this.space = initial_size;

  /**
   * Minimum alignment encountered so far.
   *
   * @type {number}
   * @private
   */
  this.minalign = 1;

  /**
   * The vtable for the current table.
   *
   * @type {Array.<number>}
   * @private
   */
  this.vtable = null;

  /**
   * The amount of fields we're actually using.
   *
   * @type {number}
   * @private
   */
  this.vtable_in_use = 0;

  /**
   * Whether we are currently serializing a table.
   *
   * @type {boolean}
   * @private
   */
  this.isNested = false;

  /**
   * Starting offset of the current struct/table.
   *
   * @type {number}
   * @private
   */
  this.object_start = 0;

  /**
   * List of offsets of all vtables.
   *
   * @type {Array.<number>}
   * @private
   */
  this.vtables = [];

  /**
   * For the current vector being built.
   *
   * @type {number}
   * @private
   */
  this.vector_num_elems = 0;

  /**
   * False omits default values from the serialized data
   *
   * @type {boolean}
   * @private
   */
  this.force_defaults = false;
};

flatbuffers.Builder.prototype.clear = function() {
  this.bb.clear();
  this.space = this.bb.capacity();
  this.minalign = 1;
  this.vtable = null;
  this.vtable_in_use = 0;
  this.isNested = false;
  this.object_start = 0;
  this.vtables = [];
  this.vector_num_elems = 0;
  this.force_defaults = false;
};

/**
 * In order to save space, fields that are set to their default value
 * don't get serialized into the buffer. Forcing defaults provides a
 * way to manually disable this optimization.
 *
 * @param {boolean} forceDefaults true always serializes default values
 */
flatbuffers.Builder.prototype.forceDefaults = function(forceDefaults) {
  this.force_defaults = forceDefaults;
};

/**
 * Get the ByteBuffer representing the FlatBuffer. Only call this after you've
 * called finish(). The actual data starts at the ByteBuffer's current position,
 * not necessarily at 0.
 *
 * @returns {flatbuffers.ByteBuffer}
 */
flatbuffers.Builder.prototype.dataBuffer = function() {
  return this.bb;
};

/**
 * Get the bytes representing the FlatBuffer. Only call this after you've
 * called finish().
 *
 * @returns {!Uint8Array}
 */
flatbuffers.Builder.prototype.asUint8Array = function() {
  return this.bb.bytes().subarray(this.bb.position(), this.bb.position() + this.offset());
};

/// @cond FLATBUFFERS_INTERNAL
/**
 * Prepare to write an element of `size` after `additional_bytes` have been
 * written, e.g. if you write a string, you need to align such the int length
 * field is aligned to 4 bytes, and the string data follows it directly. If all
 * you need to do is alignment, `additional_bytes` will be 0.
 *
 * @param {number} size This is the of the new element to write
 * @param {number} additional_bytes The padding size
 */
flatbuffers.Builder.prototype.prep = function(size, additional_bytes) {
  // Track the biggest thing we've ever aligned to.
  if (size > this.minalign) {
    this.minalign = size;
  }

  // Find the amount of alignment needed such that `size` is properly
  // aligned after `additional_bytes`
  var align_size = ((~(this.bb.capacity() - this.space + additional_bytes)) + 1) & (size - 1);

  // Reallocate the buffer if needed.
  while (this.space < align_size + size + additional_bytes) {
    var old_buf_size = this.bb.capacity();
    this.bb = flatbuffers.Builder.growByteBuffer(this.bb);
    this.space += this.bb.capacity() - old_buf_size;
  }

  this.pad(align_size);
};

/**
 * @param {number} byte_size
 */
flatbuffers.Builder.prototype.pad = function(byte_size) {
  for (var i = 0; i < byte_size; i++) {
    this.bb.writeInt8(--this.space, 0);
  }
};

/**
 * @param {number} value
 */
flatbuffers.Builder.prototype.writeInt8 = function(value) {
  this.bb.writeInt8(this.space -= 1, value);
};

/**
 * @param {number} value
 */
flatbuffers.Builder.prototype.writeInt16 = function(value) {
  this.bb.writeInt16(this.space -= 2, value);
};

/**
 * @param {number} value
 */
flatbuffers.Builder.prototype.writeInt32 = function(value) {
  this.bb.writeInt32(this.space -= 4, value);
};

/**
 * @param {flatbuffers.Long} value
 */
flatbuffers.Builder.prototype.writeInt64 = function(value) {
  this.bb.writeInt64(this.space -= 8, value);
};

/**
 * @param {number} value
 */
flatbuffers.Builder.prototype.writeFloat32 = function(value) {
  this.bb.writeFloat32(this.space -= 4, value);
};

/**
 * @param {number} value
 */
flatbuffers.Builder.prototype.writeFloat64 = function(value) {
  this.bb.writeFloat64(this.space -= 8, value);
};
/// @endcond

/**
 * Add an `int8` to the buffer, properly aligned, and grows the buffer (if necessary).
 * @param {number} value The `int8` to add the the buffer.
 */
flatbuffers.Builder.prototype.addInt8 = function(value) {
  this.prep(1, 0);
  this.writeInt8(value);
};

/**
 * Add an `int16` to the buffer, properly aligned, and grows the buffer (if necessary).
 * @param {number} value The `int16` to add the the buffer.
 */
flatbuffers.Builder.prototype.addInt16 = function(value) {
  this.prep(2, 0);
  this.writeInt16(value);
};

/**
 * Add an `int32` to the buffer, properly aligned, and grows the buffer (if necessary).
 * @param {number} value The `int32` to add the the buffer.
 */
flatbuffers.Builder.prototype.addInt32 = function(value) {
  this.prep(4, 0);
  this.writeInt32(value);
};

/**
 * Add an `int64` to the buffer, properly aligned, and grows the buffer (if necessary).
 * @param {flatbuffers.Long} value The `int64` to add the the buffer.
 */
flatbuffers.Builder.prototype.addInt64 = function(value) {
  this.prep(8, 0);
  this.writeInt64(value);
};

/**
 * Add a `float32` to the buffer, properly aligned, and grows the buffer (if necessary).
 * @param {number} value The `float32` to add the the buffer.
 */
flatbuffers.Builder.prototype.addFloat32 = function(value) {
  this.prep(4, 0);
  this.writeFloat32(value);
};

/**
 * Add a `float64` to the buffer, properly aligned, and grows the buffer (if necessary).
 * @param {number} value The `float64` to add the the buffer.
 */
flatbuffers.Builder.prototype.addFloat64 = function(value) {
  this.prep(8, 0);
  this.writeFloat64(value);
};

/// @cond FLATBUFFERS_INTERNAL
/**
 * @param {number} voffset
 * @param {number} value
 * @param {number} defaultValue
 */
flatbuffers.Builder.prototype.addFieldInt8 = function(voffset, value, defaultValue) {
  if (this.force_defaults || value != defaultValue) {
    this.addInt8(value);
    this.slot(voffset);
  }
};

/**
 * @param {number} voffset
 * @param {number} value
 * @param {number} defaultValue
 */
flatbuffers.Builder.prototype.addFieldInt16 = function(voffset, value, defaultValue) {
  if (this.force_defaults || value != defaultValue) {
    this.addInt16(value);
    this.slot(voffset);
  }
};

/**
 * @param {number} voffset
 * @param {number} value
 * @param {number} defaultValue
 */
flatbuffers.Builder.prototype.addFieldInt32 = function(voffset, value, defaultValue) {
  if (this.force_defaults || value != defaultValue) {
    this.addInt32(value);
    this.slot(voffset);
  }
};

/**
 * @param {number} voffset
 * @param {flatbuffers.Long} value
 * @param {flatbuffers.Long} defaultValue
 */
flatbuffers.Builder.prototype.addFieldInt64 = function(voffset, value, defaultValue) {
  if (this.force_defaults || !value.equals(defaultValue)) {
    this.addInt64(value);
    this.slot(voffset);
  }
};

/**
 * @param {number} voffset
 * @param {number} value
 * @param {number} defaultValue
 */
flatbuffers.Builder.prototype.addFieldFloat32 = function(voffset, value, defaultValue) {
  if (this.force_defaults || value != defaultValue) {
    this.addFloat32(value);
    this.slot(voffset);
  }
};

/**
 * @param {number} voffset
 * @param {number} value
 * @param {number} defaultValue
 */
flatbuffers.Builder.prototype.addFieldFloat64 = function(voffset, value, defaultValue) {
  if (this.force_defaults || value != defaultValue) {
    this.addFloat64(value);
    this.slot(voffset);
  }
};

/**
 * @param {number} voffset
 * @param {flatbuffers.Offset} value
 * @param {flatbuffers.Offset} defaultValue
 */
flatbuffers.Builder.prototype.addFieldOffset = function(voffset, value, defaultValue) {
  if (this.force_defaults || value != defaultValue) {
    this.addOffset(value);
    this.slot(voffset);
  }
};

/**
 * Structs are stored inline, so nothing additional is being added. `d` is always 0.
 *
 * @param {number} voffset
 * @param {flatbuffers.Offset} value
 * @param {flatbuffers.Offset} defaultValue
 */
flatbuffers.Builder.prototype.addFieldStruct = function(voffset, value, defaultValue) {
  if (value != defaultValue) {
    this.nested(value);
    this.slot(voffset);
  }
};

/**
 * Structures are always stored inline, they need to be created right
 * where they're used.  You'll get this assertion failure if you
 * created it elsewhere.
 *
 * @param {flatbuffers.Offset} obj The offset of the created object
 */
flatbuffers.Builder.prototype.nested = function(obj) {
  if (obj != this.offset()) {
    throw new Error('FlatBuffers: struct must be serialized inline.');
  }
};

/**
 * Should not be creating any other object, string or vector
 * while an object is being constructed
 */
flatbuffers.Builder.prototype.notNested = function() {
  if (this.isNested) {
    throw new Error('FlatBuffers: object serialization must not be nested.');
  }
};

/**
 * Set the current vtable at `voffset` to the current location in the buffer.
 *
 * @param {number} voffset
 */
flatbuffers.Builder.prototype.slot = function(voffset) {
  this.vtable[voffset] = this.offset();
};

/**
 * @returns {flatbuffers.Offset} Offset relative to the end of the buffer.
 */
flatbuffers.Builder.prototype.offset = function() {
  return this.bb.capacity() - this.space;
};

/**
 * Doubles the size of the backing ByteBuffer and copies the old data towards
 * the end of the new buffer (since we build the buffer backwards).
 *
 * @param {flatbuffers.ByteBuffer} bb The current buffer with the existing data
 * @returns {!flatbuffers.ByteBuffer} A new byte buffer with the old data copied
 * to it. The data is located at the end of the buffer.
 *
 * uint8Array.set() formally takes {Array<number>|ArrayBufferView}, so to pass
 * it a uint8Array we need to suppress the type check:
 * @suppress {checkTypes}
 */
flatbuffers.Builder.growByteBuffer = function(bb) {
  var old_buf_size = bb.capacity();

  // Ensure we don't grow beyond what fits in an int.
  if (old_buf_size & 0xC0000000) {
    throw new Error('FlatBuffers: cannot grow buffer beyond 2 gigabytes.');
  }

  var new_buf_size = old_buf_size << 1;
  var nbb = flatbuffers.ByteBuffer.allocate(new_buf_size);
  nbb.setPosition(new_buf_size - old_buf_size);
  nbb.bytes().set(bb.bytes(), new_buf_size - old_buf_size);
  return nbb;
};
/// @endcond

/**
 * Adds on offset, relative to where it will be written.
 *
 * @param {flatbuffers.Offset} offset The offset to add.
 */
flatbuffers.Builder.prototype.addOffset = function(offset) {
  this.prep(flatbuffers.SIZEOF_INT, 0); // Ensure alignment is already done.
  this.writeInt32(this.offset() - offset + flatbuffers.SIZEOF_INT);
};

/// @cond FLATBUFFERS_INTERNAL
/**
 * Start encoding a new object in the buffer.  Users will not usually need to
 * call this directly. The FlatBuffers compiler will generate helper methods
 * that call this method internally.
 *
 * @param {number} numfields
 */
flatbuffers.Builder.prototype.startObject = function(numfields) {
  this.notNested();
  if (this.vtable == null) {
    this.vtable = [];
  }
  this.vtable_in_use = numfields;
  for (var i = 0; i < numfields; i++) {
    this.vtable[i] = 0; // This will push additional elements as needed
  }
  this.isNested = true;
  this.object_start = this.offset();
};

/**
 * Finish off writing the object that is under construction.
 *
 * @returns {flatbuffers.Offset} The offset to the object inside `dataBuffer`
 */
flatbuffers.Builder.prototype.endObject = function() {
  if (this.vtable == null || !this.isNested) {
    throw new Error('FlatBuffers: endObject called without startObject');
  }

  this.addInt32(0);
  var vtableloc = this.offset();

  // Trim trailing zeroes.
  var i = this.vtable_in_use - 1;
  for (; i >= 0 && this.vtable[i] == 0; i--) {}
  var trimmed_size = i + 1;

  // Write out the current vtable.
  for (; i >= 0; i--) {
    // Offset relative to the start of the table.
    this.addInt16(this.vtable[i] != 0 ? vtableloc - this.vtable[i] : 0);
  }

  var standard_fields = 2; // The fields below:
  this.addInt16(vtableloc - this.object_start);
  var len = (trimmed_size + standard_fields) * flatbuffers.SIZEOF_SHORT;
  this.addInt16(len);

  // Search for an existing vtable that matches the current one.
  var existing_vtable = 0;
  var vt1 = this.space;
outer_loop:
  for (i = 0; i < this.vtables.length; i++) {
    var vt2 = this.bb.capacity() - this.vtables[i];
    if (len == this.bb.readInt16(vt2)) {
      for (var j = flatbuffers.SIZEOF_SHORT; j < len; j += flatbuffers.SIZEOF_SHORT) {
        if (this.bb.readInt16(vt1 + j) != this.bb.readInt16(vt2 + j)) {
          continue outer_loop;
        }
      }
      existing_vtable = this.vtables[i];
      break;
    }
  }

  if (existing_vtable) {
    // Found a match:
    // Remove the current vtable.
    this.space = this.bb.capacity() - vtableloc;

    // Point table to existing vtable.
    this.bb.writeInt32(this.space, existing_vtable - vtableloc);
  } else {
    // No match:
    // Add the location of the current vtable to the list of vtables.
    this.vtables.push(this.offset());

    // Point table to current vtable.
    this.bb.writeInt32(this.bb.capacity() - vtableloc, this.offset() - vtableloc);
  }

  this.isNested = false;
  return vtableloc;
};
/// @endcond

/**
 * Finalize a buffer, poiting to the given `root_table`.
 *
 * @param {flatbuffers.Offset} root_table
 * @param {string=} opt_file_identifier
 * @param {boolean=} opt_size_prefix
 */
flatbuffers.Builder.prototype.finish = function(root_table, opt_file_identifier, opt_size_prefix) {
  var size_prefix = opt_size_prefix ? flatbuffers.SIZE_PREFIX_LENGTH : 0;
  if (opt_file_identifier) {
    var file_identifier = opt_file_identifier;
    this.prep(this.minalign, flatbuffers.SIZEOF_INT +
      flatbuffers.FILE_IDENTIFIER_LENGTH + size_prefix);
    if (file_identifier.length != flatbuffers.FILE_IDENTIFIER_LENGTH) {
      throw new Error('FlatBuffers: file identifier must be length ' +
        flatbuffers.FILE_IDENTIFIER_LENGTH);
    }
    for (var i = flatbuffers.FILE_IDENTIFIER_LENGTH - 1; i >= 0; i--) {
      this.writeInt8(file_identifier.charCodeAt(i));
    }
  }
  this.prep(this.minalign, flatbuffers.SIZEOF_INT + size_prefix);
  this.addOffset(root_table);
  if (size_prefix) {
    this.addInt32(this.bb.capacity() - this.space);
  }
  this.bb.setPosition(this.space);
};

/**
 * Finalize a size prefixed buffer, pointing to the given `root_table`.
 *
 * @param {flatbuffers.Offset} root_table
 * @param {string=} opt_file_identifier
 */
flatbuffers.Builder.prototype.finishSizePrefixed = function (root_table, opt_file_identifier) {
  this.finish(root_table, opt_file_identifier, true);
};

/// @cond FLATBUFFERS_INTERNAL
/**
 * This checks a required field has been set in a given table that has
 * just been constructed.
 *
 * @param {flatbuffers.Offset} table
 * @param {number} field
 */
flatbuffers.Builder.prototype.requiredField = function(table, field) {
  var table_start = this.bb.capacity() - table;
  var vtable_start = table_start - this.bb.readInt32(table_start);
  var ok = this.bb.readInt16(vtable_start + field) != 0;

  // If this fails, the caller will show what field needs to be set.
  if (!ok) {
    throw new Error('FlatBuffers: field ' + field + ' must be set');
  }
};

/**
 * Start a new array/vector of objects.  Users usually will not call
 * this directly. The FlatBuffers compiler will create a start/end
 * method for vector types in generated code.
 *
 * @param {number} elem_size The size of each element in the array
 * @param {number} num_elems The number of elements in the array
 * @param {number} alignment The alignment of the array
 */
flatbuffers.Builder.prototype.startVector = function(elem_size, num_elems, alignment) {
  this.notNested();
  this.vector_num_elems = num_elems;
  this.prep(flatbuffers.SIZEOF_INT, elem_size * num_elems);
  this.prep(alignment, elem_size * num_elems); // Just in case alignment > int.
};

/**
 * Finish off the creation of an array and all its elements. The array must be
 * created with `startVector`.
 *
 * @returns {flatbuffers.Offset} The offset at which the newly created array
 * starts.
 */
flatbuffers.Builder.prototype.endVector = function() {
  this.writeInt32(this.vector_num_elems);
  return this.offset();
};
/// @endcond

/**
 * Encode the string `s` in the buffer using UTF-8. If a Uint8Array is passed
 * instead of a string, it is assumed to contain valid UTF-8 encoded data.
 *
 * @param {string|Uint8Array} s The string to encode
 * @return {flatbuffers.Offset} The offset in the buffer where the encoded string starts
 */
flatbuffers.Builder.prototype.createString = function(s) {
  if (s instanceof Uint8Array) {
    var utf8 = s;
  } else {
    var utf8 = [];
    var i = 0;

    while (i < s.length) {
      var codePoint;

      // Decode UTF-16
      var a = s.charCodeAt(i++);
      if (a < 0xD800 || a >= 0xDC00) {
        codePoint = a;
      } else {
        var b = s.charCodeAt(i++);
        codePoint = (a << 10) + b + (0x10000 - (0xD800 << 10) - 0xDC00);
      }

      // Encode UTF-8
      if (codePoint < 0x80) {
        utf8.push(codePoint);
      } else {
        if (codePoint < 0x800) {
          utf8.push(((codePoint >> 6) & 0x1F) | 0xC0);
        } else {
          if (codePoint < 0x10000) {
            utf8.push(((codePoint >> 12) & 0x0F) | 0xE0);
          } else {
            utf8.push(
              ((codePoint >> 18) & 0x07) | 0xF0,
              ((codePoint >> 12) & 0x3F) | 0x80);
          }
          utf8.push(((codePoint >> 6) & 0x3F) | 0x80);
        }
        utf8.push((codePoint & 0x3F) | 0x80);
      }
    }
  }

  this.addInt8(0);
  this.startVector(1, utf8.length, 1);
  this.bb.setPosition(this.space -= utf8.length);
  for (var i = 0, offset = this.space, bytes = this.bb.bytes(); i < utf8.length; i++) {
    bytes[offset++] = utf8[i];
  }
  return this.endVector();
};

/**
 * A helper function to avoid generated code depending on this file directly.
 *
 * @param {number} low
 * @param {number} high
 * @returns {!flatbuffers.Long}
 */
flatbuffers.Builder.prototype.createLong = function(low, high) {
  return flatbuffers.Long.create(low, high);
};
////////////////////////////////////////////////////////////////////////////////
/// @cond FLATBUFFERS_INTERNAL
/**
 * Create a new ByteBuffer with a given array of bytes (`Uint8Array`).
 *
 * @constructor
 * @param {Uint8Array} bytes
 */
flatbuffers.ByteBuffer = function(bytes) {
  /**
   * @type {Uint8Array}
   * @private
   */
  this.bytes_ = bytes;

  /**
   * @type {number}
   * @private
   */
  this.position_ = 0;
};

/**
 * Create and allocate a new ByteBuffer with a given size.
 *
 * @param {number} byte_size
 * @returns {!flatbuffers.ByteBuffer}
 */
flatbuffers.ByteBuffer.allocate = function(byte_size) {
  return new flatbuffers.ByteBuffer(new Uint8Array(byte_size));
};

flatbuffers.ByteBuffer.prototype.clear = function() {
  this.position_ = 0;
};

/**
 * Get the underlying `Uint8Array`.
 *
 * @returns {Uint8Array}
 */
flatbuffers.ByteBuffer.prototype.bytes = function() {
  return this.bytes_;
};

/**
 * Get the buffer's position.
 *
 * @returns {number}
 */
flatbuffers.ByteBuffer.prototype.position = function() {
  return this.position_;
};

/**
 * Set the buffer's position.
 *
 * @param {number} position
 */
flatbuffers.ByteBuffer.prototype.setPosition = function(position) {
  this.position_ = position;
};

/**
 * Get the buffer's capacity.
 *
 * @returns {number}
 */
flatbuffers.ByteBuffer.prototype.capacity = function() {
  return this.bytes_.length;
};

/**
 * @param {number} offset
 * @returns {number}
 */
flatbuffers.ByteBuffer.prototype.readInt8 = function(offset) {
  return this.readUint8(offset) << 24 >> 24;
};

/**
 * @param {number} offset
 * @returns {number}
 */
flatbuffers.ByteBuffer.prototype.readUint8 = function(offset) {
  return this.bytes_[offset];
};

/**
 * @param {number} offset
 * @returns {number}
 */
flatbuffers.ByteBuffer.prototype.readInt16 = function(offset) {
  return this.readUint16(offset) << 16 >> 16;
};

/**
 * @param {number} offset
 * @returns {number}
 */
flatbuffers.ByteBuffer.prototype.readUint16 = function(offset) {
  return this.bytes_[offset] | this.bytes_[offset + 1] << 8;
};

/**
 * @param {number} offset
 * @returns {number}
 */
flatbuffers.ByteBuffer.prototype.readInt32 = function(offset) {
  return this.bytes_[offset] | this.bytes_[offset + 1] << 8 | this.bytes_[offset + 2] << 16 | this.bytes_[offset + 3] << 24;
};

/**
 * @param {number} offset
 * @returns {number}
 */
flatbuffers.ByteBuffer.prototype.readUint32 = function(offset) {
  return this.readInt32(offset) >>> 0;
};

/**
 * @param {number} offset
 * @returns {!flatbuffers.Long}
 */
flatbuffers.ByteBuffer.prototype.readInt64 = function(offset) {
  return new flatbuffers.Long(this.readInt32(offset), this.readInt32(offset + 4));
};

/**
 * @param {number} offset
 * @returns {!flatbuffers.Long}
 */
flatbuffers.ByteBuffer.prototype.readUint64 = function(offset) {
  return new flatbuffers.Long(this.readUint32(offset), this.readUint32(offset + 4));
};

/**
 * @param {number} offset
 * @returns {number}
 */
flatbuffers.ByteBuffer.prototype.readFloat32 = function(offset) {
  flatbuffers.int32[0] = this.readInt32(offset);
  return flatbuffers.float32[0];
};

/**
 * @param {number} offset
 * @returns {number}
 */
flatbuffers.ByteBuffer.prototype.readFloat64 = function(offset) {
  flatbuffers.int32[flatbuffers.isLittleEndian ? 0 : 1] = this.readInt32(offset);
  flatbuffers.int32[flatbuffers.isLittleEndian ? 1 : 0] = this.readInt32(offset + 4);
  return flatbuffers.float64[0];
};

/**
 * @param {number} offset
 * @param {number|boolean} value
 */
flatbuffers.ByteBuffer.prototype.writeInt8 = function(offset, value) {
  this.bytes_[offset] = /** @type {number} */(value);
};

/**
 * @param {number} offset
 * @param {number} value
 */
flatbuffers.ByteBuffer.prototype.writeUint8 = function(offset, value) {
  this.bytes_[offset] = value;
};

/**
 * @param {number} offset
 * @param {number} value
 */
flatbuffers.ByteBuffer.prototype.writeInt16 = function(offset, value) {
  this.bytes_[offset] = value;
  this.bytes_[offset + 1] = value >> 8;
};

/**
 * @param {number} offset
 * @param {number} value
 */
flatbuffers.ByteBuffer.prototype.writeUint16 = function(offset, value) {
    this.bytes_[offset] = value;
    this.bytes_[offset + 1] = value >> 8;
};

/**
 * @param {number} offset
 * @param {number} value
 */
flatbuffers.ByteBuffer.prototype.writeInt32 = function(offset, value) {
  this.bytes_[offset] = value;
  this.bytes_[offset + 1] = value >> 8;
  this.bytes_[offset + 2] = value >> 16;
  this.bytes_[offset + 3] = value >> 24;
};

/**
 * @param {number} offset
 * @param {number} value
 */
flatbuffers.ByteBuffer.prototype.writeUint32 = function(offset, value) {
    this.bytes_[offset] = value;
    this.bytes_[offset + 1] = value >> 8;
    this.bytes_[offset + 2] = value >> 16;
    this.bytes_[offset + 3] = value >> 24;
};

/**
 * @param {number} offset
 * @param {flatbuffers.Long} value
 */
flatbuffers.ByteBuffer.prototype.writeInt64 = function(offset, value) {
  this.writeInt32(offset, value.low);
  this.writeInt32(offset + 4, value.high);
};

/**
 * @param {number} offset
 * @param {flatbuffers.Long} value
 */
flatbuffers.ByteBuffer.prototype.writeUint64 = function(offset, value) {
    this.writeUint32(offset, value.low);
    this.writeUint32(offset + 4, value.high);
};

/**
 * @param {number} offset
 * @param {number} value
 */
flatbuffers.ByteBuffer.prototype.writeFloat32 = function(offset, value) {
  flatbuffers.float32[0] = value;
  this.writeInt32(offset, flatbuffers.int32[0]);
};

/**
 * @param {number} offset
 * @param {number} value
 */
flatbuffers.ByteBuffer.prototype.writeFloat64 = function(offset, value) {
  flatbuffers.float64[0] = value;
  this.writeInt32(offset, flatbuffers.int32[flatbuffers.isLittleEndian ? 0 : 1]);
  this.writeInt32(offset + 4, flatbuffers.int32[flatbuffers.isLittleEndian ? 1 : 0]);
};

/**
 * Return the file identifier.   Behavior is undefined for FlatBuffers whose
 * schema does not include a file_identifier (likely points at padding or the
 * start of a the root vtable).
 * @returns {string}
 */
flatbuffers.ByteBuffer.prototype.getBufferIdentifier = function() {
  if (this.bytes_.length < this.position_ + flatbuffers.SIZEOF_INT +
      flatbuffers.FILE_IDENTIFIER_LENGTH) {
    throw new Error(
        'FlatBuffers: ByteBuffer is too short to contain an identifier.');
  }
  var result = "";
  for (var i = 0; i < flatbuffers.FILE_IDENTIFIER_LENGTH; i++) {
    result += String.fromCharCode(
        this.readInt8(this.position_ + flatbuffers.SIZEOF_INT + i));
  }
  return result;
};

/**
 * Look up a field in the vtable, return an offset into the object, or 0 if the
 * field is not present.
 *
 * @param {number} bb_pos
 * @param {number} vtable_offset
 * @returns {number}
 */
flatbuffers.ByteBuffer.prototype.__offset = function(bb_pos, vtable_offset) {
  var vtable = bb_pos - this.readInt32(bb_pos);
  return vtable_offset < this.readInt16(vtable) ? this.readInt16(vtable + vtable_offset) : 0;
};

/**
 * Initialize any Table-derived type to point to the union at the given offset.
 *
 * @param {flatbuffers.Table} t
 * @param {number} offset
 * @returns {flatbuffers.Table}
 */
flatbuffers.ByteBuffer.prototype.__union = function(t, offset) {
  t.bb_pos = offset + this.readInt32(offset);
  t.bb = this;
  return t;
};

/**
 * Create a JavaScript string from UTF-8 data stored inside the FlatBuffer.
 * This allocates a new string and converts to wide chars upon each access.
 *
 * To avoid the conversion to UTF-16, pass flatbuffers.Encoding.UTF8_BYTES as
 * the "optionalEncoding" argument. This is useful for avoiding conversion to
 * and from UTF-16 when the data will just be packaged back up in another
 * FlatBuffer later on.
 *
 * @param {number} offset
 * @param {flatbuffers.Encoding=} opt_encoding Defaults to UTF16_STRING
 * @returns {string|!Uint8Array}
 */
flatbuffers.ByteBuffer.prototype.__string = function(offset, opt_encoding) {
  offset += this.readInt32(offset);

  var length = this.readInt32(offset);
  var result = '';
  var i = 0;

  offset += flatbuffers.SIZEOF_INT;

  if (opt_encoding === flatbuffers.Encoding.UTF8_BYTES) {
    return this.bytes_.subarray(offset, offset + length);
  }

  while (i < length) {
    var codePoint;

    // Decode UTF-8
    var a = this.readUint8(offset + i++);
    if (a < 0xC0) {
      codePoint = a;
    } else {
      var b = this.readUint8(offset + i++);
      if (a < 0xE0) {
        codePoint =
          ((a & 0x1F) << 6) |
          (b & 0x3F);
      } else {
        var c = this.readUint8(offset + i++);
        if (a < 0xF0) {
          codePoint =
            ((a & 0x0F) << 12) |
            ((b & 0x3F) << 6) |
            (c & 0x3F);
        } else {
          var d = this.readUint8(offset + i++);
          codePoint =
            ((a & 0x07) << 18) |
            ((b & 0x3F) << 12) |
            ((c & 0x3F) << 6) |
            (d & 0x3F);
        }
      }
    }

    // Encode UTF-16
    if (codePoint < 0x10000) {
      result += String.fromCharCode(codePoint);
    } else {
      codePoint -= 0x10000;
      result += String.fromCharCode(
        (codePoint >> 10) + 0xD800,
        (codePoint & ((1 << 10) - 1)) + 0xDC00);
    }
  }

  return result;
};

/**
 * Retrieve the relative offset stored at "offset"
 * @param {number} offset
 * @returns {number}
 */
flatbuffers.ByteBuffer.prototype.__indirect = function(offset) {
  return offset + this.readInt32(offset);
};

/**
 * Get the start of data of a vector whose offset is stored at "offset" in this object.
 *
 * @param {number} offset
 * @returns {number}
 */
flatbuffers.ByteBuffer.prototype.__vector = function(offset) {
  return offset + this.readInt32(offset) + flatbuffers.SIZEOF_INT; // data starts after the length
};

/**
 * Get the length of a vector whose offset is stored at "offset" in this object.
 *
 * @param {number} offset
 * @returns {number}
 */
flatbuffers.ByteBuffer.prototype.__vector_len = function(offset) {
  return this.readInt32(offset + this.readInt32(offset));
};

/**
 * @param {string} ident
 * @returns {boolean}
 */
flatbuffers.ByteBuffer.prototype.__has_identifier = function(ident) {
  if (ident.length != flatbuffers.FILE_IDENTIFIER_LENGTH) {
    throw new Error('FlatBuffers: file identifier must be length ' +
                    flatbuffers.FILE_IDENTIFIER_LENGTH);
  }
  for (var i = 0; i < flatbuffers.FILE_IDENTIFIER_LENGTH; i++) {
    if (ident.charCodeAt(i) != this.readInt8(this.position_ + flatbuffers.SIZEOF_INT + i)) {
      return false;
    }
  }
  return true;
};

/**
 * A helper function to avoid generated code depending on this file directly.
 *
 * @param {number} low
 * @param {number} high
 * @returns {!flatbuffers.Long}
 */
flatbuffers.ByteBuffer.prototype.createLong = function(low, high) {
  return flatbuffers.Long.create(low, high);
};

/// @endcond
/// @}

var flatbuffers$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	flatbuffers: flatbuffers
});

var flatbuffers_1 = getCjsExportFromNamespace(flatbuffers$1);

var header_generated = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.Header = exports.Crs = exports.Column = exports.ColumnType = exports.GeometryType = void 0;

var GeometryType;
(function (GeometryType) {
    GeometryType[GeometryType["Unknown"] = 0] = "Unknown";
    GeometryType[GeometryType["Point"] = 1] = "Point";
    GeometryType[GeometryType["LineString"] = 2] = "LineString";
    GeometryType[GeometryType["Polygon"] = 3] = "Polygon";
    GeometryType[GeometryType["MultiPoint"] = 4] = "MultiPoint";
    GeometryType[GeometryType["MultiLineString"] = 5] = "MultiLineString";
    GeometryType[GeometryType["MultiPolygon"] = 6] = "MultiPolygon";
    GeometryType[GeometryType["GeometryCollection"] = 7] = "GeometryCollection";
    GeometryType[GeometryType["CircularString"] = 8] = "CircularString";
    GeometryType[GeometryType["CompoundCurve"] = 9] = "CompoundCurve";
    GeometryType[GeometryType["CurvePolygon"] = 10] = "CurvePolygon";
    GeometryType[GeometryType["MultiCurve"] = 11] = "MultiCurve";
    GeometryType[GeometryType["MultiSurface"] = 12] = "MultiSurface";
    GeometryType[GeometryType["Curve"] = 13] = "Curve";
    GeometryType[GeometryType["Surface"] = 14] = "Surface";
    GeometryType[GeometryType["PolyhedralSurface"] = 15] = "PolyhedralSurface";
    GeometryType[GeometryType["TIN"] = 16] = "TIN";
    GeometryType[GeometryType["Triangle"] = 17] = "Triangle";
})(GeometryType = exports.GeometryType || (exports.GeometryType = {}));
var ColumnType;
(function (ColumnType) {
    ColumnType[ColumnType["Byte"] = 0] = "Byte";
    ColumnType[ColumnType["UByte"] = 1] = "UByte";
    ColumnType[ColumnType["Bool"] = 2] = "Bool";
    ColumnType[ColumnType["Short"] = 3] = "Short";
    ColumnType[ColumnType["UShort"] = 4] = "UShort";
    ColumnType[ColumnType["Int"] = 5] = "Int";
    ColumnType[ColumnType["UInt"] = 6] = "UInt";
    ColumnType[ColumnType["Long"] = 7] = "Long";
    ColumnType[ColumnType["ULong"] = 8] = "ULong";
    ColumnType[ColumnType["Float"] = 9] = "Float";
    ColumnType[ColumnType["Double"] = 10] = "Double";
    ColumnType[ColumnType["String"] = 11] = "String";
    ColumnType[ColumnType["Json"] = 12] = "Json";
    ColumnType[ColumnType["DateTime"] = 13] = "DateTime";
    ColumnType[ColumnType["Binary"] = 14] = "Binary";
})(ColumnType = exports.ColumnType || (exports.ColumnType = {}));
var Column = (function () {
    function Column() {
        this.bb = null;
        this.bb_pos = 0;
    }
    Column.prototype.__init = function (i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
    };
    Column.getRoot = function (bb, obj) {
        return (obj || new Column()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    };
    Column.getSizePrefixedRoot = function (bb, obj) {
        bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
        return (obj || new Column()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    };
    Column.prototype.name = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    Column.prototype.type = function () {
        var offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? (this.bb.readUint8(this.bb_pos + offset)) : ColumnType.Byte;
    };
    Column.prototype.title = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    Column.prototype.description = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    Column.prototype.width = function () {
        var offset = this.bb.__offset(this.bb_pos, 12);
        return offset ? this.bb.readInt32(this.bb_pos + offset) : -1;
    };
    Column.prototype.precision = function () {
        var offset = this.bb.__offset(this.bb_pos, 14);
        return offset ? this.bb.readInt32(this.bb_pos + offset) : -1;
    };
    Column.prototype.scale = function () {
        var offset = this.bb.__offset(this.bb_pos, 16);
        return offset ? this.bb.readInt32(this.bb_pos + offset) : -1;
    };
    Column.prototype.nullable = function () {
        var offset = this.bb.__offset(this.bb_pos, 18);
        return offset ? !!this.bb.readInt8(this.bb_pos + offset) : true;
    };
    Column.prototype.unique = function () {
        var offset = this.bb.__offset(this.bb_pos, 20);
        return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
    };
    Column.prototype.primaryKey = function () {
        var offset = this.bb.__offset(this.bb_pos, 22);
        return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
    };
    Column.prototype.metadata = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 24);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    Column.start = function (builder) {
        builder.startObject(11);
    };
    Column.addName = function (builder, nameOffset) {
        builder.addFieldOffset(0, nameOffset, 0);
    };
    Column.addType = function (builder, type) {
        builder.addFieldInt8(1, type, ColumnType.Byte);
    };
    Column.addTitle = function (builder, titleOffset) {
        builder.addFieldOffset(2, titleOffset, 0);
    };
    Column.addDescription = function (builder, descriptionOffset) {
        builder.addFieldOffset(3, descriptionOffset, 0);
    };
    Column.addWidth = function (builder, width) {
        builder.addFieldInt32(4, width, -1);
    };
    Column.addPrecision = function (builder, precision) {
        builder.addFieldInt32(5, precision, -1);
    };
    Column.addScale = function (builder, scale) {
        builder.addFieldInt32(6, scale, -1);
    };
    Column.addNullable = function (builder, nullable) {
        builder.addFieldInt8(7, +nullable, +true);
    };
    Column.addUnique = function (builder, unique) {
        builder.addFieldInt8(8, +unique, +false);
    };
    Column.addPrimaryKey = function (builder, primaryKey) {
        builder.addFieldInt8(9, +primaryKey, +false);
    };
    Column.addMetadata = function (builder, metadataOffset) {
        builder.addFieldOffset(10, metadataOffset, 0);
    };
    Column.end = function (builder) {
        var offset = builder.endObject();
        builder.requiredField(offset, 4);
        return offset;
    };
    Column.create = function (builder, nameOffset, type, titleOffset, descriptionOffset, width, precision, scale, nullable, unique, primaryKey, metadataOffset) {
        Column.start(builder);
        Column.addName(builder, nameOffset);
        Column.addType(builder, type);
        Column.addTitle(builder, titleOffset);
        Column.addDescription(builder, descriptionOffset);
        Column.addWidth(builder, width);
        Column.addPrecision(builder, precision);
        Column.addScale(builder, scale);
        Column.addNullable(builder, nullable);
        Column.addUnique(builder, unique);
        Column.addPrimaryKey(builder, primaryKey);
        Column.addMetadata(builder, metadataOffset);
        return Column.end(builder);
    };
    return Column;
}());
exports.Column = Column;
var Crs = (function () {
    function Crs() {
        this.bb = null;
        this.bb_pos = 0;
    }
    Crs.prototype.__init = function (i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
    };
    Crs.getRoot = function (bb, obj) {
        return (obj || new Crs()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    };
    Crs.getSizePrefixedRoot = function (bb, obj) {
        bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
        return (obj || new Crs()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    };
    Crs.prototype.org = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    Crs.prototype.code = function () {
        var offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
    };
    Crs.prototype.name = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    Crs.prototype.description = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    Crs.prototype.wkt = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 12);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    Crs.prototype.codeString = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 14);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    Crs.start = function (builder) {
        builder.startObject(6);
    };
    Crs.addOrg = function (builder, orgOffset) {
        builder.addFieldOffset(0, orgOffset, 0);
    };
    Crs.addCode = function (builder, code) {
        builder.addFieldInt32(1, code, 0);
    };
    Crs.addName = function (builder, nameOffset) {
        builder.addFieldOffset(2, nameOffset, 0);
    };
    Crs.addDescription = function (builder, descriptionOffset) {
        builder.addFieldOffset(3, descriptionOffset, 0);
    };
    Crs.addWkt = function (builder, wktOffset) {
        builder.addFieldOffset(4, wktOffset, 0);
    };
    Crs.addCodeString = function (builder, codeStringOffset) {
        builder.addFieldOffset(5, codeStringOffset, 0);
    };
    Crs.end = function (builder) {
        var offset = builder.endObject();
        return offset;
    };
    Crs.create = function (builder, orgOffset, code, nameOffset, descriptionOffset, wktOffset, codeStringOffset) {
        Crs.start(builder);
        Crs.addOrg(builder, orgOffset);
        Crs.addCode(builder, code);
        Crs.addName(builder, nameOffset);
        Crs.addDescription(builder, descriptionOffset);
        Crs.addWkt(builder, wktOffset);
        Crs.addCodeString(builder, codeStringOffset);
        return Crs.end(builder);
    };
    return Crs;
}());
exports.Crs = Crs;
var Header = (function () {
    function Header() {
        this.bb = null;
        this.bb_pos = 0;
    }
    Header.prototype.__init = function (i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
    };
    Header.getRoot = function (bb, obj) {
        return (obj || new Header()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    };
    Header.getSizePrefixedRoot = function (bb, obj) {
        bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
        return (obj || new Header()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    };
    Header.prototype.name = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    Header.prototype.envelope = function (index) {
        var offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? this.bb.readFloat64(this.bb.__vector(this.bb_pos + offset) + index * 8) : 0;
    };
    Header.prototype.envelopeLength = function () {
        var offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
    };
    Header.prototype.envelopeArray = function () {
        var offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? new Float64Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
    };
    Header.prototype.geometryType = function () {
        var offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? (this.bb.readUint8(this.bb_pos + offset)) : GeometryType.Unknown;
    };
    Header.prototype.hasZ = function () {
        var offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
    };
    Header.prototype.hasM = function () {
        var offset = this.bb.__offset(this.bb_pos, 12);
        return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
    };
    Header.prototype.hasT = function () {
        var offset = this.bb.__offset(this.bb_pos, 14);
        return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
    };
    Header.prototype.hasTM = function () {
        var offset = this.bb.__offset(this.bb_pos, 16);
        return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
    };
    Header.prototype.columns = function (index, obj) {
        var offset = this.bb.__offset(this.bb_pos, 18);
        return offset ? (obj || new Column()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
    };
    Header.prototype.columnsLength = function () {
        var offset = this.bb.__offset(this.bb_pos, 18);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
    };
    Header.prototype.featuresCount = function () {
        var offset = this.bb.__offset(this.bb_pos, 20);
        return offset ? this.bb.readUint64(this.bb_pos + offset) : this.bb.createLong(0, 0);
    };
    Header.prototype.indexNodeSize = function () {
        var offset = this.bb.__offset(this.bb_pos, 22);
        return offset ? this.bb.readUint16(this.bb_pos + offset) : 16;
    };
    Header.prototype.crs = function (obj) {
        var offset = this.bb.__offset(this.bb_pos, 24);
        return offset ? (obj || new Crs()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
    };
    Header.prototype.title = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 26);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    Header.prototype.description = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 28);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    Header.prototype.metadata = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 30);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    Header.start = function (builder) {
        builder.startObject(14);
    };
    Header.addName = function (builder, nameOffset) {
        builder.addFieldOffset(0, nameOffset, 0);
    };
    Header.addEnvelope = function (builder, envelopeOffset) {
        builder.addFieldOffset(1, envelopeOffset, 0);
    };
    Header.createEnvelopeVector = function (builder, data) {
        builder.startVector(8, data.length, 8);
        for (var i = data.length - 1; i >= 0; i--) {
            builder.addFloat64(data[i]);
        }
        return builder.endVector();
    };
    Header.startEnvelopeVector = function (builder, numElems) {
        builder.startVector(8, numElems, 8);
    };
    Header.addGeometryType = function (builder, geometryType) {
        builder.addFieldInt8(2, geometryType, GeometryType.Unknown);
    };
    Header.addHasZ = function (builder, hasZ) {
        builder.addFieldInt8(3, +hasZ, +false);
    };
    Header.addHasM = function (builder, hasM) {
        builder.addFieldInt8(4, +hasM, +false);
    };
    Header.addHasT = function (builder, hasT) {
        builder.addFieldInt8(5, +hasT, +false);
    };
    Header.addHasTM = function (builder, hasTM) {
        builder.addFieldInt8(6, +hasTM, +false);
    };
    Header.addColumns = function (builder, columnsOffset) {
        builder.addFieldOffset(7, columnsOffset, 0);
    };
    Header.createColumnsVector = function (builder, data) {
        builder.startVector(4, data.length, 4);
        for (var i = data.length - 1; i >= 0; i--) {
            builder.addOffset(data[i]);
        }
        return builder.endVector();
    };
    Header.startColumnsVector = function (builder, numElems) {
        builder.startVector(4, numElems, 4);
    };
    Header.addFeaturesCount = function (builder, featuresCount) {
        builder.addFieldInt64(8, featuresCount, builder.createLong(0, 0));
    };
    Header.addIndexNodeSize = function (builder, indexNodeSize) {
        builder.addFieldInt16(9, indexNodeSize, 16);
    };
    Header.addCrs = function (builder, crsOffset) {
        builder.addFieldOffset(10, crsOffset, 0);
    };
    Header.addTitle = function (builder, titleOffset) {
        builder.addFieldOffset(11, titleOffset, 0);
    };
    Header.addDescription = function (builder, descriptionOffset) {
        builder.addFieldOffset(12, descriptionOffset, 0);
    };
    Header.addMetadata = function (builder, metadataOffset) {
        builder.addFieldOffset(13, metadataOffset, 0);
    };
    Header.end = function (builder) {
        var offset = builder.endObject();
        return offset;
    };
    Header.finishBuffer = function (builder, offset) {
        builder.finish(offset);
    };
    Header.finishSizePrefixedBuffer = function (builder, offset) {
        builder.finish(offset, undefined, true);
    };
    Header.create = function (builder, nameOffset, envelopeOffset, geometryType, hasZ, hasM, hasT, hasTM, columnsOffset, featuresCount, indexNodeSize, crsOffset, titleOffset, descriptionOffset, metadataOffset) {
        Header.start(builder);
        Header.addName(builder, nameOffset);
        Header.addEnvelope(builder, envelopeOffset);
        Header.addGeometryType(builder, geometryType);
        Header.addHasZ(builder, hasZ);
        Header.addHasM(builder, hasM);
        Header.addHasT(builder, hasT);
        Header.addHasTM(builder, hasTM);
        Header.addColumns(builder, columnsOffset);
        Header.addFeaturesCount(builder, featuresCount);
        Header.addIndexNodeSize(builder, indexNodeSize);
        Header.addCrs(builder, crsOffset);
        Header.addTitle(builder, titleOffset);
        Header.addDescription(builder, descriptionOffset);
        Header.addMetadata(builder, metadataOffset);
        return Header.end(builder);
    };
    return Header;
}());
exports.Header = Header;

});

unwrapExports(header_generated);
var header_generated_1 = header_generated.Header;
var header_generated_2 = header_generated.Crs;
var header_generated_3 = header_generated.Column;
var header_generated_4 = header_generated.ColumnType;
var header_generated_5 = header_generated.GeometryType;

var CrsMeta_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
var CrsMeta = (function () {
    function CrsMeta(org, code, name, description, wkt, code_string) {
        this.org = org;
        this.code = code;
        this.name = name;
        this.description = description;
        this.wkt = wkt;
        this.code_string = code_string;
    }
    return CrsMeta;
}());
exports.default = CrsMeta;

});

unwrapExports(CrsMeta_1);

var HeaderMeta_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ColumnMeta_1$1 = __importDefault(ColumnMeta_1);
var CrsMeta_1$1 = __importDefault(CrsMeta_1);

var HeaderMeta = (function () {
    function HeaderMeta(geometryType, columns, featuresCount, indexNodeSize, crs, title, description, metadata) {
        this.geometryType = geometryType;
        this.columns = columns;
        this.featuresCount = featuresCount;
        this.indexNodeSize = indexNodeSize;
        this.crs = crs;
        this.title = title;
        this.description = description;
        this.metadata = metadata;
    }
    HeaderMeta.fromByteBuffer = function (bb) {
        var header = header_generated.Header.getRoot(bb);
        var featuresCount = header.featuresCount().toFloat64();
        var indexNodeSize = header.indexNodeSize();
        var columns = [];
        for (var j = 0; j < header.columnsLength(); j++) {
            var column = header.columns(j);
            if (!column)
                throw new Error('Column unexpectedly missing');
            if (!column.name())
                throw new Error('Column name unexpectedly missing');
            columns.push(new ColumnMeta_1$1.default(column.name(), column.type(), column.title(), column.description(), column.width(), column.precision(), column.scale(), column.nullable(), column.unique(), column.primaryKey()));
        }
        var crs = header.crs();
        var crsMeta = (crs ? new CrsMeta_1$1.default(crs.org(), crs.code(), crs.name(), crs.description(), crs.wkt(), crs.codeString()) : null);
        var headerMeta = new HeaderMeta(header.geometryType(), columns, featuresCount, indexNodeSize, crsMeta, header.title(), header.description(), header.metadata());
        return headerMeta;
    };
    return HeaderMeta;
}());
exports.default = HeaderMeta;

});

unwrapExports(HeaderMeta_1);

var feature_generated = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feature = exports.Geometry = exports.Header = exports.Crs = exports.Column = exports.ColumnType = exports.GeometryType = void 0;

var GeometryType;
(function (GeometryType) {
    GeometryType[GeometryType["Unknown"] = 0] = "Unknown";
    GeometryType[GeometryType["Point"] = 1] = "Point";
    GeometryType[GeometryType["LineString"] = 2] = "LineString";
    GeometryType[GeometryType["Polygon"] = 3] = "Polygon";
    GeometryType[GeometryType["MultiPoint"] = 4] = "MultiPoint";
    GeometryType[GeometryType["MultiLineString"] = 5] = "MultiLineString";
    GeometryType[GeometryType["MultiPolygon"] = 6] = "MultiPolygon";
    GeometryType[GeometryType["GeometryCollection"] = 7] = "GeometryCollection";
    GeometryType[GeometryType["CircularString"] = 8] = "CircularString";
    GeometryType[GeometryType["CompoundCurve"] = 9] = "CompoundCurve";
    GeometryType[GeometryType["CurvePolygon"] = 10] = "CurvePolygon";
    GeometryType[GeometryType["MultiCurve"] = 11] = "MultiCurve";
    GeometryType[GeometryType["MultiSurface"] = 12] = "MultiSurface";
    GeometryType[GeometryType["Curve"] = 13] = "Curve";
    GeometryType[GeometryType["Surface"] = 14] = "Surface";
    GeometryType[GeometryType["PolyhedralSurface"] = 15] = "PolyhedralSurface";
    GeometryType[GeometryType["TIN"] = 16] = "TIN";
    GeometryType[GeometryType["Triangle"] = 17] = "Triangle";
})(GeometryType = exports.GeometryType || (exports.GeometryType = {}));
var ColumnType;
(function (ColumnType) {
    ColumnType[ColumnType["Byte"] = 0] = "Byte";
    ColumnType[ColumnType["UByte"] = 1] = "UByte";
    ColumnType[ColumnType["Bool"] = 2] = "Bool";
    ColumnType[ColumnType["Short"] = 3] = "Short";
    ColumnType[ColumnType["UShort"] = 4] = "UShort";
    ColumnType[ColumnType["Int"] = 5] = "Int";
    ColumnType[ColumnType["UInt"] = 6] = "UInt";
    ColumnType[ColumnType["Long"] = 7] = "Long";
    ColumnType[ColumnType["ULong"] = 8] = "ULong";
    ColumnType[ColumnType["Float"] = 9] = "Float";
    ColumnType[ColumnType["Double"] = 10] = "Double";
    ColumnType[ColumnType["String"] = 11] = "String";
    ColumnType[ColumnType["Json"] = 12] = "Json";
    ColumnType[ColumnType["DateTime"] = 13] = "DateTime";
    ColumnType[ColumnType["Binary"] = 14] = "Binary";
})(ColumnType = exports.ColumnType || (exports.ColumnType = {}));
var Column = (function () {
    function Column() {
        this.bb = null;
        this.bb_pos = 0;
    }
    Column.prototype.__init = function (i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
    };
    Column.getRoot = function (bb, obj) {
        return (obj || new Column()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    };
    Column.getSizePrefixedRoot = function (bb, obj) {
        bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
        return (obj || new Column()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    };
    Column.prototype.name = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    Column.prototype.type = function () {
        var offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? (this.bb.readUint8(this.bb_pos + offset)) : ColumnType.Byte;
    };
    Column.prototype.title = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    Column.prototype.description = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    Column.prototype.width = function () {
        var offset = this.bb.__offset(this.bb_pos, 12);
        return offset ? this.bb.readInt32(this.bb_pos + offset) : -1;
    };
    Column.prototype.precision = function () {
        var offset = this.bb.__offset(this.bb_pos, 14);
        return offset ? this.bb.readInt32(this.bb_pos + offset) : -1;
    };
    Column.prototype.scale = function () {
        var offset = this.bb.__offset(this.bb_pos, 16);
        return offset ? this.bb.readInt32(this.bb_pos + offset) : -1;
    };
    Column.prototype.nullable = function () {
        var offset = this.bb.__offset(this.bb_pos, 18);
        return offset ? !!this.bb.readInt8(this.bb_pos + offset) : true;
    };
    Column.prototype.unique = function () {
        var offset = this.bb.__offset(this.bb_pos, 20);
        return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
    };
    Column.prototype.primaryKey = function () {
        var offset = this.bb.__offset(this.bb_pos, 22);
        return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
    };
    Column.prototype.metadata = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 24);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    Column.start = function (builder) {
        builder.startObject(11);
    };
    Column.addName = function (builder, nameOffset) {
        builder.addFieldOffset(0, nameOffset, 0);
    };
    Column.addType = function (builder, type) {
        builder.addFieldInt8(1, type, ColumnType.Byte);
    };
    Column.addTitle = function (builder, titleOffset) {
        builder.addFieldOffset(2, titleOffset, 0);
    };
    Column.addDescription = function (builder, descriptionOffset) {
        builder.addFieldOffset(3, descriptionOffset, 0);
    };
    Column.addWidth = function (builder, width) {
        builder.addFieldInt32(4, width, -1);
    };
    Column.addPrecision = function (builder, precision) {
        builder.addFieldInt32(5, precision, -1);
    };
    Column.addScale = function (builder, scale) {
        builder.addFieldInt32(6, scale, -1);
    };
    Column.addNullable = function (builder, nullable) {
        builder.addFieldInt8(7, +nullable, +true);
    };
    Column.addUnique = function (builder, unique) {
        builder.addFieldInt8(8, +unique, +false);
    };
    Column.addPrimaryKey = function (builder, primaryKey) {
        builder.addFieldInt8(9, +primaryKey, +false);
    };
    Column.addMetadata = function (builder, metadataOffset) {
        builder.addFieldOffset(10, metadataOffset, 0);
    };
    Column.end = function (builder) {
        var offset = builder.endObject();
        builder.requiredField(offset, 4);
        return offset;
    };
    Column.create = function (builder, nameOffset, type, titleOffset, descriptionOffset, width, precision, scale, nullable, unique, primaryKey, metadataOffset) {
        Column.start(builder);
        Column.addName(builder, nameOffset);
        Column.addType(builder, type);
        Column.addTitle(builder, titleOffset);
        Column.addDescription(builder, descriptionOffset);
        Column.addWidth(builder, width);
        Column.addPrecision(builder, precision);
        Column.addScale(builder, scale);
        Column.addNullable(builder, nullable);
        Column.addUnique(builder, unique);
        Column.addPrimaryKey(builder, primaryKey);
        Column.addMetadata(builder, metadataOffset);
        return Column.end(builder);
    };
    return Column;
}());
exports.Column = Column;
var Crs = (function () {
    function Crs() {
        this.bb = null;
        this.bb_pos = 0;
    }
    Crs.prototype.__init = function (i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
    };
    Crs.getRoot = function (bb, obj) {
        return (obj || new Crs()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    };
    Crs.getSizePrefixedRoot = function (bb, obj) {
        bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
        return (obj || new Crs()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    };
    Crs.prototype.org = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    Crs.prototype.code = function () {
        var offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
    };
    Crs.prototype.name = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    Crs.prototype.description = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    Crs.prototype.wkt = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 12);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    Crs.prototype.codeString = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 14);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    Crs.start = function (builder) {
        builder.startObject(6);
    };
    Crs.addOrg = function (builder, orgOffset) {
        builder.addFieldOffset(0, orgOffset, 0);
    };
    Crs.addCode = function (builder, code) {
        builder.addFieldInt32(1, code, 0);
    };
    Crs.addName = function (builder, nameOffset) {
        builder.addFieldOffset(2, nameOffset, 0);
    };
    Crs.addDescription = function (builder, descriptionOffset) {
        builder.addFieldOffset(3, descriptionOffset, 0);
    };
    Crs.addWkt = function (builder, wktOffset) {
        builder.addFieldOffset(4, wktOffset, 0);
    };
    Crs.addCodeString = function (builder, codeStringOffset) {
        builder.addFieldOffset(5, codeStringOffset, 0);
    };
    Crs.end = function (builder) {
        var offset = builder.endObject();
        return offset;
    };
    Crs.create = function (builder, orgOffset, code, nameOffset, descriptionOffset, wktOffset, codeStringOffset) {
        Crs.start(builder);
        Crs.addOrg(builder, orgOffset);
        Crs.addCode(builder, code);
        Crs.addName(builder, nameOffset);
        Crs.addDescription(builder, descriptionOffset);
        Crs.addWkt(builder, wktOffset);
        Crs.addCodeString(builder, codeStringOffset);
        return Crs.end(builder);
    };
    return Crs;
}());
exports.Crs = Crs;
var Header = (function () {
    function Header() {
        this.bb = null;
        this.bb_pos = 0;
    }
    Header.prototype.__init = function (i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
    };
    Header.getRoot = function (bb, obj) {
        return (obj || new Header()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    };
    Header.getSizePrefixedRoot = function (bb, obj) {
        bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
        return (obj || new Header()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    };
    Header.prototype.name = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    Header.prototype.envelope = function (index) {
        var offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? this.bb.readFloat64(this.bb.__vector(this.bb_pos + offset) + index * 8) : 0;
    };
    Header.prototype.envelopeLength = function () {
        var offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
    };
    Header.prototype.envelopeArray = function () {
        var offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? new Float64Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
    };
    Header.prototype.geometryType = function () {
        var offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? (this.bb.readUint8(this.bb_pos + offset)) : GeometryType.Unknown;
    };
    Header.prototype.hasZ = function () {
        var offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
    };
    Header.prototype.hasM = function () {
        var offset = this.bb.__offset(this.bb_pos, 12);
        return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
    };
    Header.prototype.hasT = function () {
        var offset = this.bb.__offset(this.bb_pos, 14);
        return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
    };
    Header.prototype.hasTM = function () {
        var offset = this.bb.__offset(this.bb_pos, 16);
        return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
    };
    Header.prototype.columns = function (index, obj) {
        var offset = this.bb.__offset(this.bb_pos, 18);
        return offset ? (obj || new Column()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
    };
    Header.prototype.columnsLength = function () {
        var offset = this.bb.__offset(this.bb_pos, 18);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
    };
    Header.prototype.featuresCount = function () {
        var offset = this.bb.__offset(this.bb_pos, 20);
        return offset ? this.bb.readUint64(this.bb_pos + offset) : this.bb.createLong(0, 0);
    };
    Header.prototype.indexNodeSize = function () {
        var offset = this.bb.__offset(this.bb_pos, 22);
        return offset ? this.bb.readUint16(this.bb_pos + offset) : 16;
    };
    Header.prototype.crs = function (obj) {
        var offset = this.bb.__offset(this.bb_pos, 24);
        return offset ? (obj || new Crs()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
    };
    Header.prototype.title = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 26);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    Header.prototype.description = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 28);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    Header.prototype.metadata = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 30);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    Header.start = function (builder) {
        builder.startObject(14);
    };
    Header.addName = function (builder, nameOffset) {
        builder.addFieldOffset(0, nameOffset, 0);
    };
    Header.addEnvelope = function (builder, envelopeOffset) {
        builder.addFieldOffset(1, envelopeOffset, 0);
    };
    Header.createEnvelopeVector = function (builder, data) {
        builder.startVector(8, data.length, 8);
        for (var i = data.length - 1; i >= 0; i--) {
            builder.addFloat64(data[i]);
        }
        return builder.endVector();
    };
    Header.startEnvelopeVector = function (builder, numElems) {
        builder.startVector(8, numElems, 8);
    };
    Header.addGeometryType = function (builder, geometryType) {
        builder.addFieldInt8(2, geometryType, GeometryType.Unknown);
    };
    Header.addHasZ = function (builder, hasZ) {
        builder.addFieldInt8(3, +hasZ, +false);
    };
    Header.addHasM = function (builder, hasM) {
        builder.addFieldInt8(4, +hasM, +false);
    };
    Header.addHasT = function (builder, hasT) {
        builder.addFieldInt8(5, +hasT, +false);
    };
    Header.addHasTM = function (builder, hasTM) {
        builder.addFieldInt8(6, +hasTM, +false);
    };
    Header.addColumns = function (builder, columnsOffset) {
        builder.addFieldOffset(7, columnsOffset, 0);
    };
    Header.createColumnsVector = function (builder, data) {
        builder.startVector(4, data.length, 4);
        for (var i = data.length - 1; i >= 0; i--) {
            builder.addOffset(data[i]);
        }
        return builder.endVector();
    };
    Header.startColumnsVector = function (builder, numElems) {
        builder.startVector(4, numElems, 4);
    };
    Header.addFeaturesCount = function (builder, featuresCount) {
        builder.addFieldInt64(8, featuresCount, builder.createLong(0, 0));
    };
    Header.addIndexNodeSize = function (builder, indexNodeSize) {
        builder.addFieldInt16(9, indexNodeSize, 16);
    };
    Header.addCrs = function (builder, crsOffset) {
        builder.addFieldOffset(10, crsOffset, 0);
    };
    Header.addTitle = function (builder, titleOffset) {
        builder.addFieldOffset(11, titleOffset, 0);
    };
    Header.addDescription = function (builder, descriptionOffset) {
        builder.addFieldOffset(12, descriptionOffset, 0);
    };
    Header.addMetadata = function (builder, metadataOffset) {
        builder.addFieldOffset(13, metadataOffset, 0);
    };
    Header.end = function (builder) {
        var offset = builder.endObject();
        return offset;
    };
    Header.create = function (builder, nameOffset, envelopeOffset, geometryType, hasZ, hasM, hasT, hasTM, columnsOffset, featuresCount, indexNodeSize, crsOffset, titleOffset, descriptionOffset, metadataOffset) {
        Header.start(builder);
        Header.addName(builder, nameOffset);
        Header.addEnvelope(builder, envelopeOffset);
        Header.addGeometryType(builder, geometryType);
        Header.addHasZ(builder, hasZ);
        Header.addHasM(builder, hasM);
        Header.addHasT(builder, hasT);
        Header.addHasTM(builder, hasTM);
        Header.addColumns(builder, columnsOffset);
        Header.addFeaturesCount(builder, featuresCount);
        Header.addIndexNodeSize(builder, indexNodeSize);
        Header.addCrs(builder, crsOffset);
        Header.addTitle(builder, titleOffset);
        Header.addDescription(builder, descriptionOffset);
        Header.addMetadata(builder, metadataOffset);
        return Header.end(builder);
    };
    return Header;
}());
exports.Header = Header;
var Geometry = (function () {
    function Geometry() {
        this.bb = null;
        this.bb_pos = 0;
    }
    Geometry.prototype.__init = function (i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
    };
    Geometry.getRoot = function (bb, obj) {
        return (obj || new Geometry()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    };
    Geometry.getSizePrefixedRoot = function (bb, obj) {
        bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
        return (obj || new Geometry()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    };
    Geometry.prototype.ends = function (index) {
        var offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.readUint32(this.bb.__vector(this.bb_pos + offset) + index * 4) : 0;
    };
    Geometry.prototype.endsLength = function () {
        var offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
    };
    Geometry.prototype.endsArray = function () {
        var offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? new Uint32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
    };
    Geometry.prototype.xy = function (index) {
        var offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? this.bb.readFloat64(this.bb.__vector(this.bb_pos + offset) + index * 8) : 0;
    };
    Geometry.prototype.xyLength = function () {
        var offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
    };
    Geometry.prototype.xyArray = function () {
        var offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? new Float64Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
    };
    Geometry.prototype.z = function (index) {
        var offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? this.bb.readFloat64(this.bb.__vector(this.bb_pos + offset) + index * 8) : 0;
    };
    Geometry.prototype.zLength = function () {
        var offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
    };
    Geometry.prototype.zArray = function () {
        var offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? new Float64Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
    };
    Geometry.prototype.m = function (index) {
        var offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? this.bb.readFloat64(this.bb.__vector(this.bb_pos + offset) + index * 8) : 0;
    };
    Geometry.prototype.mLength = function () {
        var offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
    };
    Geometry.prototype.mArray = function () {
        var offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? new Float64Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
    };
    Geometry.prototype.t = function (index) {
        var offset = this.bb.__offset(this.bb_pos, 12);
        return offset ? this.bb.readFloat64(this.bb.__vector(this.bb_pos + offset) + index * 8) : 0;
    };
    Geometry.prototype.tLength = function () {
        var offset = this.bb.__offset(this.bb_pos, 12);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
    };
    Geometry.prototype.tArray = function () {
        var offset = this.bb.__offset(this.bb_pos, 12);
        return offset ? new Float64Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
    };
    Geometry.prototype.tm = function (index) {
        var offset = this.bb.__offset(this.bb_pos, 14);
        return offset ? this.bb.readUint64(this.bb.__vector(this.bb_pos + offset) + index * 8) : this.bb.createLong(0, 0);
    };
    Geometry.prototype.tmLength = function () {
        var offset = this.bb.__offset(this.bb_pos, 14);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
    };
    Geometry.prototype.type = function () {
        var offset = this.bb.__offset(this.bb_pos, 16);
        return offset ? (this.bb.readUint8(this.bb_pos + offset)) : GeometryType.Unknown;
    };
    Geometry.prototype.parts = function (index, obj) {
        var offset = this.bb.__offset(this.bb_pos, 18);
        return offset ? (obj || new Geometry()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
    };
    Geometry.prototype.partsLength = function () {
        var offset = this.bb.__offset(this.bb_pos, 18);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
    };
    Geometry.start = function (builder) {
        builder.startObject(8);
    };
    Geometry.addEnds = function (builder, endsOffset) {
        builder.addFieldOffset(0, endsOffset, 0);
    };
    Geometry.createEndsVector = function (builder, data) {
        builder.startVector(4, data.length, 4);
        for (var i = data.length - 1; i >= 0; i--) {
            builder.addInt32(data[i]);
        }
        return builder.endVector();
    };
    Geometry.startEndsVector = function (builder, numElems) {
        builder.startVector(4, numElems, 4);
    };
    Geometry.addXy = function (builder, xyOffset) {
        builder.addFieldOffset(1, xyOffset, 0);
    };
    Geometry.createXyVector = function (builder, data) {
        builder.startVector(8, data.length, 8);
        for (var i = data.length - 1; i >= 0; i--) {
            builder.addFloat64(data[i]);
        }
        return builder.endVector();
    };
    Geometry.startXyVector = function (builder, numElems) {
        builder.startVector(8, numElems, 8);
    };
    Geometry.addZ = function (builder, zOffset) {
        builder.addFieldOffset(2, zOffset, 0);
    };
    Geometry.createZVector = function (builder, data) {
        builder.startVector(8, data.length, 8);
        for (var i = data.length - 1; i >= 0; i--) {
            builder.addFloat64(data[i]);
        }
        return builder.endVector();
    };
    Geometry.startZVector = function (builder, numElems) {
        builder.startVector(8, numElems, 8);
    };
    Geometry.addM = function (builder, mOffset) {
        builder.addFieldOffset(3, mOffset, 0);
    };
    Geometry.createMVector = function (builder, data) {
        builder.startVector(8, data.length, 8);
        for (var i = data.length - 1; i >= 0; i--) {
            builder.addFloat64(data[i]);
        }
        return builder.endVector();
    };
    Geometry.startMVector = function (builder, numElems) {
        builder.startVector(8, numElems, 8);
    };
    Geometry.addT = function (builder, tOffset) {
        builder.addFieldOffset(4, tOffset, 0);
    };
    Geometry.createTVector = function (builder, data) {
        builder.startVector(8, data.length, 8);
        for (var i = data.length - 1; i >= 0; i--) {
            builder.addFloat64(data[i]);
        }
        return builder.endVector();
    };
    Geometry.startTVector = function (builder, numElems) {
        builder.startVector(8, numElems, 8);
    };
    Geometry.addTm = function (builder, tmOffset) {
        builder.addFieldOffset(5, tmOffset, 0);
    };
    Geometry.createTmVector = function (builder, data) {
        builder.startVector(8, data.length, 8);
        for (var i = data.length - 1; i >= 0; i--) {
            builder.addInt64(data[i]);
        }
        return builder.endVector();
    };
    Geometry.startTmVector = function (builder, numElems) {
        builder.startVector(8, numElems, 8);
    };
    Geometry.addType = function (builder, type) {
        builder.addFieldInt8(6, type, GeometryType.Unknown);
    };
    Geometry.addParts = function (builder, partsOffset) {
        builder.addFieldOffset(7, partsOffset, 0);
    };
    Geometry.createPartsVector = function (builder, data) {
        builder.startVector(4, data.length, 4);
        for (var i = data.length - 1; i >= 0; i--) {
            builder.addOffset(data[i]);
        }
        return builder.endVector();
    };
    Geometry.startPartsVector = function (builder, numElems) {
        builder.startVector(4, numElems, 4);
    };
    Geometry.end = function (builder) {
        var offset = builder.endObject();
        return offset;
    };
    Geometry.create = function (builder, endsOffset, xyOffset, zOffset, mOffset, tOffset, tmOffset, type, partsOffset) {
        Geometry.start(builder);
        Geometry.addEnds(builder, endsOffset);
        Geometry.addXy(builder, xyOffset);
        Geometry.addZ(builder, zOffset);
        Geometry.addM(builder, mOffset);
        Geometry.addT(builder, tOffset);
        Geometry.addTm(builder, tmOffset);
        Geometry.addType(builder, type);
        Geometry.addParts(builder, partsOffset);
        return Geometry.end(builder);
    };
    return Geometry;
}());
exports.Geometry = Geometry;
var Feature = (function () {
    function Feature() {
        this.bb = null;
        this.bb_pos = 0;
    }
    Feature.prototype.__init = function (i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
    };
    Feature.getRoot = function (bb, obj) {
        return (obj || new Feature()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    };
    Feature.getSizePrefixedRoot = function (bb, obj) {
        bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
        return (obj || new Feature()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    };
    Feature.prototype.geometry = function (obj) {
        var offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? (obj || new Geometry()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
    };
    Feature.prototype.properties = function (index) {
        var offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? this.bb.readUint8(this.bb.__vector(this.bb_pos + offset) + index) : 0;
    };
    Feature.prototype.propertiesLength = function () {
        var offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
    };
    Feature.prototype.propertiesArray = function () {
        var offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? new Uint8Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
    };
    Feature.prototype.columns = function (index, obj) {
        var offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? (obj || new Column()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
    };
    Feature.prototype.columnsLength = function () {
        var offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
    };
    Feature.start = function (builder) {
        builder.startObject(3);
    };
    Feature.addGeometry = function (builder, geometryOffset) {
        builder.addFieldOffset(0, geometryOffset, 0);
    };
    Feature.addProperties = function (builder, propertiesOffset) {
        builder.addFieldOffset(1, propertiesOffset, 0);
    };
    Feature.createPropertiesVector = function (builder, data) {
        builder.startVector(1, data.length, 1);
        for (var i = data.length - 1; i >= 0; i--) {
            builder.addInt8(data[i]);
        }
        return builder.endVector();
    };
    Feature.startPropertiesVector = function (builder, numElems) {
        builder.startVector(1, numElems, 1);
    };
    Feature.addColumns = function (builder, columnsOffset) {
        builder.addFieldOffset(2, columnsOffset, 0);
    };
    Feature.createColumnsVector = function (builder, data) {
        builder.startVector(4, data.length, 4);
        for (var i = data.length - 1; i >= 0; i--) {
            builder.addOffset(data[i]);
        }
        return builder.endVector();
    };
    Feature.startColumnsVector = function (builder, numElems) {
        builder.startVector(4, numElems, 4);
    };
    Feature.end = function (builder) {
        var offset = builder.endObject();
        return offset;
    };
    Feature.finishBuffer = function (builder, offset) {
        builder.finish(offset);
    };
    Feature.finishSizePrefixedBuffer = function (builder, offset) {
        builder.finish(offset, undefined, true);
    };
    Feature.create = function (builder, geometryOffset, propertiesOffset, columnsOffset) {
        Feature.start(builder);
        Feature.addGeometry(builder, geometryOffset);
        Feature.addProperties(builder, propertiesOffset);
        Feature.addColumns(builder, columnsOffset);
        return Feature.end(builder);
    };
    return Feature;
}());
exports.Feature = Feature;

});

unwrapExports(feature_generated);
var feature_generated_1 = feature_generated.Feature;
var feature_generated_2 = feature_generated.Geometry;
var feature_generated_3 = feature_generated.Header;
var feature_generated_4 = feature_generated.Crs;
var feature_generated_5 = feature_generated.Column;
var feature_generated_6 = feature_generated.ColumnType;
var feature_generated_7 = feature_generated.GeometryType;

var geometry = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.toGeometryType = exports.pairFlatCoordinates = exports.parseGeometry = exports.flat = exports.buildGeometry = void 0;


function buildGeometry(builder, parsedGeometry) {
    var xy = parsedGeometry.xy, z = parsedGeometry.z, ends = parsedGeometry.ends, parts = parsedGeometry.parts, type = parsedGeometry.type;
    if (parts) {
        var partOffsets = parts.map(function (part) { return buildGeometry(builder, part); });
        var partsOffset = feature_generated.Geometry.createPartsVector(builder, partOffsets);
        feature_generated.Geometry.start(builder);
        feature_generated.Geometry.addParts(builder, partsOffset);
        return feature_generated.Geometry.end(builder);
    }
    var xyOffset = feature_generated.Geometry.createXyVector(builder, xy);
    var zOffset;
    if (z)
        zOffset = feature_generated.Geometry.createZVector(builder, z);
    var endsOffset;
    if (ends)
        endsOffset = feature_generated.Geometry.createEndsVector(builder, ends);
    feature_generated.Geometry.start(builder);
    if (endsOffset)
        feature_generated.Geometry.addEnds(builder, endsOffset);
    feature_generated.Geometry.addXy(builder, xyOffset);
    if (zOffset)
        feature_generated.Geometry.addZ(builder, zOffset);
    feature_generated.Geometry.addType(builder, type);
    return feature_generated.Geometry.end(builder);
}
exports.buildGeometry = buildGeometry;
function flat(a, xy, z) {
    if (a.length === 0)
        return;
    if (Array.isArray(a[0])) {
        for (var _i = 0, a_1 = a; _i < a_1.length; _i++) {
            var sa = a_1[_i];
            flat(sa, xy, z);
        }
    }
    else {
        if (a.length === 2)
            xy.push.apply(xy, a);
        else {
            xy.push(a[0], a[1]);
            z.push(a[2]);
        }
    }
}
exports.flat = flat;
function parseGeometry(geometry, type) {
    var xy;
    var ends;
    var parts;
    if (type === header_generated.GeometryType.MultiLineString) {
        if (geometry.getFlatCoordinates)
            xy = geometry.getFlatCoordinates();
        var mlsEnds = geometry.getEnds();
        if (mlsEnds.length > 1)
            ends = mlsEnds.map(function (e) { return e >> 1; });
    }
    else if (type === header_generated.GeometryType.Polygon) {
        if (geometry.getFlatCoordinates)
            xy = geometry.getFlatCoordinates();
        var pEnds = geometry.getEnds();
        if (pEnds.length > 1)
            ends = pEnds.map(function (e) { return e >> 1; });
    }
    else if (type === header_generated.GeometryType.MultiPolygon) {
        var mp = geometry;
        parts = mp.getPolygons().map(function (p) { return parseGeometry(p, header_generated.GeometryType.Polygon); });
    }
    else {
        if (geometry.getFlatCoordinates)
            xy = geometry.getFlatCoordinates();
    }
    return {
        xy: xy,
        ends: ends,
        type: type,
        parts: parts
    };
}
exports.parseGeometry = parseGeometry;
function pairFlatCoordinates(xy, z) {
    var newArray = [];
    for (var i = 0; i < xy.length; i += 2) {
        var a = [xy[i], xy[i + 1]];
        if (z)
            a.push(z[i >> 1]);
        newArray.push(a);
    }
    return newArray;
}
exports.pairFlatCoordinates = pairFlatCoordinates;
function toGeometryType(name) {
    if (!name)
        return header_generated.GeometryType.Unknown;
    var type = header_generated.GeometryType[name];
    return type;
}
exports.toGeometryType = toGeometryType;

});

unwrapExports(geometry);
var geometry_1 = geometry.toGeometryType;
var geometry_2 = geometry.pairFlatCoordinates;
var geometry_3 = geometry.parseGeometry;
var geometry_4 = geometry.flat;
var geometry_5 = geometry.buildGeometry;

var geometry$1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromGeometry = exports.parseGeometry = void 0;


function parseGeometry(geometry$1) {
    var cs = geometry$1.coordinates;
    var xy = [];
    var z = [];
    var ends;
    var parts;
    var type = geometry.toGeometryType(geometry$1.type);
    var end = 0;
    switch (geometry$1.type) {
        case 'Point':
            geometry.flat(cs, xy, z);
            break;
        case 'MultiPoint':
        case 'LineString':
            geometry.flat(cs, xy, z);
            break;
        case 'MultiLineString':
        case 'Polygon': {
            var css = cs;
            geometry.flat(css, xy, z);
            if (css.length > 1)
                ends = css.map(function (c) { return end += c.length; });
            break;
        }
        case 'MultiPolygon': {
            var csss = cs;
            var geometries = csss.map(function (coordinates) { return ({ type: 'Polygon', coordinates: coordinates }); });
            parts = geometries.map(parseGeometry);
            break;
        }
        case 'GeometryCollection':
            if (geometry$1.geometries)
                parts = geometry$1.geometries.map(parseGeometry);
            break;
    }
    return {
        xy: xy,
        z: z.length > 0 ? z : undefined,
        ends: ends,
        type: type,
        parts: parts
    };
}
exports.parseGeometry = parseGeometry;
function extractParts(xy, z, ends) {
    if (!ends || ends.length === 0)
        return [geometry.pairFlatCoordinates(xy, z)];
    var s = 0;
    var xySlices = Array.from(ends)
        .map(function (e) { return xy.slice(s, s = e << 1); });
    var zSlices;
    if (z) {
        s = 0;
        zSlices = Array.from(ends).map(function (e) { return z.slice(s, s = e); });
    }
    return xySlices
        .map(function (xy, i) { return geometry.pairFlatCoordinates(xy, zSlices ? zSlices[i] : undefined); });
}
function toGeoJsonCoordinates(geometry$1, type) {
    var xy = geometry$1.xyArray();
    var z = geometry$1.zArray();
    switch (type) {
        case header_generated.GeometryType.Point: {
            var a = Array.from(xy);
            if (z)
                a.push(z[0]);
            return a;
        }
        case header_generated.GeometryType.MultiPoint:
        case header_generated.GeometryType.LineString:
            return geometry.pairFlatCoordinates(xy, z);
        case header_generated.GeometryType.MultiLineString:
            return extractParts(xy, z, geometry$1.endsArray());
        case header_generated.GeometryType.Polygon:
            return extractParts(xy, z, geometry$1.endsArray());
    }
}
function fromGeometry(geometry, type) {
    if (type === header_generated.GeometryType.GeometryCollection) {
        var geometries = [];
        for (var i = 0; i < geometry.partsLength(); i++) {
            var part = geometry.parts(i);
            var partType = part.type();
            geometries.push(fromGeometry(part, partType));
        }
        return {
            type: header_generated.GeometryType[type],
            geometries: geometries
        };
    }
    else if (type === header_generated.GeometryType.MultiPolygon) {
        var geometries = [];
        for (var i = 0; i < geometry.partsLength(); i++)
            geometries.push(fromGeometry(geometry.parts(i), header_generated.GeometryType.Polygon));
        return {
            type: header_generated.GeometryType[type],
            coordinates: geometries.map(function (g) { return g.coordinates; })
        };
    }
    var coordinates = toGeoJsonCoordinates(geometry, type);
    return {
        type: header_generated.GeometryType[type],
        coordinates: coordinates
    };
}
exports.fromGeometry = fromGeometry;

});

unwrapExports(geometry$1);
var geometry_2$1 = geometry$1.fromGeometry;
var geometry_3$1 = geometry$1.parseGeometry;

var feature = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseProperties = exports.buildFeature = exports.fromFeature = void 0;




var textEncoder = new TextEncoder();
var textDecoder = new TextDecoder();
function fromFeature(feature, header, createGeometry, createFeature) {
    var columns = header.columns;
    var geometry = feature.geometry();
    var simpleGeometry = createGeometry(geometry, header.geometryType);
    var properties = parseProperties(feature, columns);
    return createFeature(simpleGeometry, properties);
}
exports.fromFeature = fromFeature;
function buildFeature(geometry$1, properties, header) {
    var columns = header.columns;
    var builder = new flatbuffers_1.flatbuffers.Builder();
    var offset = 0;
    var capacity = 1024;
    var bytes = new Uint8Array(capacity);
    var view = new DataView(bytes.buffer);
    var prep = function (size) {
        if (offset + size < capacity)
            return;
        capacity = capacity * 2;
        var newBytes = new Uint8Array(capacity);
        newBytes.set(bytes);
        bytes = newBytes;
        view = new DataView(bytes.buffer, offset);
    };
    if (columns) {
        for (var i = 0; i < columns.length; i++) {
            var column = columns[i];
            var value = properties[column.name];
            if (value === null)
                continue;
            view.setUint16(offset, i, true);
            offset += 2;
            switch (column.type) {
                case header_generated.ColumnType.Bool:
                    prep(1);
                    view.setUint8(offset, value);
                    offset += 1;
                    break;
                case header_generated.ColumnType.Short:
                    prep(2);
                    view.setInt16(offset, value, true);
                    offset += 2;
                    break;
                case header_generated.ColumnType.UShort:
                    prep(2);
                    view.setUint16(offset, value, true);
                    offset += 2;
                    break;
                case header_generated.ColumnType.Int:
                    prep(4);
                    view.setInt32(offset, value, true);
                    offset += 4;
                    break;
                case header_generated.ColumnType.UInt:
                    prep(4);
                    view.setUint32(offset, value, true);
                    offset += 4;
                    break;
                case header_generated.ColumnType.Long:
                    prep(8);
                    view.setBigInt64(offset, BigInt(value), true);
                    offset += 8;
                    break;
                case header_generated.ColumnType.Double:
                    prep(8);
                    view.setFloat64(offset, value, true);
                    offset += 8;
                    break;
                case header_generated.ColumnType.DateTime:
                case header_generated.ColumnType.String: {
                    var str = textEncoder.encode(value);
                    prep(4);
                    view.setUint32(offset, str.length, true);
                    offset += 4;
                    prep(str.length);
                    bytes.set(str, offset);
                    offset += str.length;
                    break;
                }
                default:
                    throw new Error('Unknown type ' + column.type);
            }
        }
    }
    var propertiesOffset = null;
    if (offset > 0)
        propertiesOffset = feature_generated.Feature.createPropertiesVector(builder, bytes.slice(0, offset));
    var geometryOffset = geometry.buildGeometry(builder, geometry$1);
    feature_generated.Feature.start(builder);
    feature_generated.Feature.addGeometry(builder, geometryOffset);
    if (propertiesOffset)
        feature_generated.Feature.addProperties(builder, propertiesOffset);
    var featureOffset = feature_generated.Feature.end(builder);
    builder.finishSizePrefixed(featureOffset);
    return builder.asUint8Array();
}
exports.buildFeature = buildFeature;
function parseProperties(feature, columns) {
    var properties = {};
    if (!columns || columns.length === 0)
        return properties;
    var array = feature.propertiesArray();
    if (!array)
        return properties;
    var view = new DataView(array.buffer, array.byteOffset);
    var length = feature.propertiesLength();
    var offset = 0;
    while (offset < length) {
        var i = view.getUint16(offset, true);
        offset += 2;
        var column = columns[i];
        var name_1 = column.name;
        switch (column.type) {
            case header_generated.ColumnType.Bool: {
                properties[name_1] = !!view.getUint8(offset);
                offset += 1;
                break;
            }
            case header_generated.ColumnType.Byte: {
                properties[name_1] = view.getInt8(offset);
                offset += 1;
                break;
            }
            case header_generated.ColumnType.UByte: {
                properties[name_1] = view.getUint8(offset);
                offset += 1;
                break;
            }
            case header_generated.ColumnType.Short: {
                properties[name_1] = view.getInt16(offset, true);
                offset += 2;
                break;
            }
            case header_generated.ColumnType.UShort: {
                properties[name_1] = view.getUint16(offset, true);
                offset += 2;
                break;
            }
            case header_generated.ColumnType.Int: {
                properties[name_1] = view.getInt32(offset, true);
                offset += 4;
                break;
            }
            case header_generated.ColumnType.UInt: {
                properties[name_1] = view.getUint32(offset, true);
                offset += 4;
                break;
            }
            case header_generated.ColumnType.Long: {
                properties[name_1] = Number(view.getBigInt64(offset, true));
                offset += 8;
                break;
            }
            case header_generated.ColumnType.ULong: {
                properties[name_1] = Number(view.getBigUint64(offset, true));
                offset += 8;
                break;
            }
            case header_generated.ColumnType.Double: {
                properties[name_1] = view.getFloat64(offset, true);
                offset += 8;
                break;
            }
            case header_generated.ColumnType.DateTime:
            case header_generated.ColumnType.String: {
                var length_1 = view.getUint32(offset, true);
                offset += 4;
                properties[name_1] = textDecoder.decode(array.subarray(offset, offset + length_1));
                offset += length_1;
                break;
            }
            default:
                throw new Error('Unknown type ' + column.type);
        }
    }
    return properties;
}
exports.parseProperties = parseProperties;

});

unwrapExports(feature);
var feature_1 = feature.parseProperties;
var feature_2 = feature.buildFeature;
var feature_3 = feature.fromFeature;

var feature$1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromFeature = void 0;


function fromFeature(feature$1, header) {
    var columns = header.columns;
    var geometry = geometry$1.fromGeometry(feature$1.geometry(), header.geometryType);
    var geoJsonfeature = {
        type: 'Feature',
        geometry: geometry
    };
    if (columns && columns.length > 0)
        geoJsonfeature.properties = feature.parseProperties(feature$1, columns);
    return geoJsonfeature;
}
exports.fromFeature = fromFeature;

});

unwrapExports(feature$1);
var feature_2$1 = feature$1.fromFeature;

var empty = new Uint8Array(0);

function slice_cancel() {
  return this._source.cancel();
}

function concat(a, b) {
  if (!a.length) return b;
  if (!b.length) return a;
  var c = new Uint8Array(a.length + b.length);
  c.set(a);
  c.set(b, a.length);
  return c;
}

function slice_read() {
  var that = this, array = that._array.subarray(that._index);
  return that._source.read().then(function(result) {
    that._array = empty;
    that._index = 0;
    return result.done ? (array.length > 0
        ? {done: false, value: array}
        : {done: true, value: undefined})
        : {done: false, value: concat(array, result.value)};
  });
}

function slice_slice(length) {
  if ((length |= 0) < 0) throw new Error("invalid length");
  var that = this, index = this._array.length - this._index;

  // If the request fits within the remaining buffer, resolve it immediately.
  if (this._index + length <= this._array.length) {
    return Promise.resolve(this._array.subarray(this._index, this._index += length));
  }

  // Otherwise, read chunks repeatedly until the request is fulfilled.
  var array = new Uint8Array(length);
  array.set(this._array.subarray(this._index));
  return (function read() {
    return that._source.read().then(function(result) {

      // When done, it’s possible the request wasn’t fully fullfilled!
      // If so, the pre-allocated array is too big and needs slicing.
      if (result.done) {
        that._array = empty;
        that._index = 0;
        return index > 0 ? array.subarray(0, index) : null;
      }

      // If this chunk fulfills the request, return the resulting array.
      if (index + result.value.length >= length) {
        that._array = result.value;
        that._index = length - index;
        array.set(result.value.subarray(0, length - index), index);
        return array;
      }

      // Otherwise copy this chunk into the array, then read the next chunk.
      array.set(result.value, index);
      index += result.value.length;
      return read();
    });
  })();
}

function slice(source) {
  return typeof source.slice === "function" ? source :
      new SliceSource(typeof source.read === "function" ? source
          : source.getReader());
}

function SliceSource(source) {
  this._source = source;
  this._array = empty;
  this._index = 0;
}

SliceSource.prototype.read = slice_read;
SliceSource.prototype.slice = slice_slice;
SliceSource.prototype.cancel = slice_cancel;

var sliceSource = /*#__PURE__*/Object.freeze({
	__proto__: null,
	'default': slice
});

var Logger_1 = createCommonjsModule(function (module, exports) {
var __spreadArray = (commonjsGlobal && commonjsGlobal.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Debug"] = 0] = "Debug";
    LogLevel[LogLevel["Info"] = 1] = "Info";
    LogLevel[LogLevel["Warn"] = 2] = "Warn";
    LogLevel[LogLevel["Error"] = 3] = "Error";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
var Logger = (function () {
    function Logger() {
    }
    Logger.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.log.apply(this, __spreadArray([LogLevel.Debug], args));
    };
    Logger.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.log.apply(this, __spreadArray([LogLevel.Info], args));
    };
    Logger.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.log.apply(this, __spreadArray([LogLevel.Warn], args));
    };
    Logger.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.log.apply(this, __spreadArray([LogLevel.Error], args));
    };
    Logger.log = function (level) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.logLevel > level) {
            return;
        }
        switch (level) {
            case LogLevel.Debug: {
                console.debug.apply(console, args);
                break;
            }
            case LogLevel.Info: {
                console.info.apply(console, args);
                break;
            }
            case LogLevel.Warn: {
                console.warn.apply(console, args);
                break;
            }
            case LogLevel.Error: {
                console.error.apply(console, args);
                break;
            }
        }
    };
    Logger.logLevel = LogLevel.Info;
    return Logger;
}());
exports.default = Logger;

});

unwrapExports(Logger_1);
var Logger_2 = Logger_1.LogLevel;

var packedrtree = createCommonjsModule(function (module, exports) {
var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __await = (commonjsGlobal && commonjsGlobal.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); };
var __asyncGenerator = (commonjsGlobal && commonjsGlobal.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamSearch = exports.calcTreeSize = exports.DEFAULT_NODE_SIZE = exports.NODE_ITEM_LEN = void 0;
var Logger_1$1 = __importDefault(Logger_1);
exports.NODE_ITEM_LEN = 8 * 4 + 8;
exports.DEFAULT_NODE_SIZE = 16;
function calcTreeSize(numItems, nodeSize) {
    nodeSize = Math.min(Math.max(+nodeSize, 2), 65535);
    var n = numItems;
    var numNodes = n;
    do {
        n = Math.ceil(n / nodeSize);
        numNodes += n;
    } while (n !== 1);
    return numNodes * exports.NODE_ITEM_LEN;
}
exports.calcTreeSize = calcTreeSize;
function generateLevelBounds(numItems, nodeSize) {
    if (nodeSize < 2)
        throw new Error('Node size must be at least 2');
    if (numItems === 0)
        throw new Error('Number of items must be greater than 0');
    var n = numItems;
    var numNodes = n;
    var levelNumNodes = [n];
    do {
        n = Math.ceil(n / nodeSize);
        numNodes += n;
        levelNumNodes.push(n);
    } while (n !== 1);
    var levelOffsets = [];
    n = numNodes;
    for (var _i = 0, levelNumNodes_1 = levelNumNodes; _i < levelNumNodes_1.length; _i++) {
        var size = levelNumNodes_1[_i];
        levelOffsets.push(n - size);
        n -= size;
    }
    levelOffsets.reverse();
    levelNumNodes.reverse();
    var levelBounds = [];
    for (var i = 0; i < levelNumNodes.length; i++)
        levelBounds.push([levelOffsets[i], levelOffsets[i] + levelNumNodes[i]]);
    levelBounds.reverse();
    return levelBounds;
}
function streamSearch(numItems, nodeSize, rect, readNode) {
    return __asyncGenerator(this, arguments, function streamSearch_1() {
        var NodeRange, minX, minY, maxX, maxY, levelBounds, leafNodesOffset, rootNodeRange, queue, _loop_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    NodeRange = (function () {
                        function NodeRange(nodes, level) {
                            this._level = level;
                            this.nodes = nodes;
                        }
                        NodeRange.prototype.level = function () {
                            return this._level;
                        };
                        NodeRange.prototype.startNode = function () {
                            return this.nodes[0];
                        };
                        NodeRange.prototype.endNode = function () {
                            return this.nodes[1];
                        };
                        NodeRange.prototype.extendEndNodeToNewOffset = function (newOffset) {
                            console.assert(newOffset > this.nodes[1]);
                            this.nodes[1] = newOffset;
                        };
                        NodeRange.prototype.toString = function () {
                            return "[NodeRange level: " + this._level + ", nodes: " + this.nodes[0] + "-" + this.nodes[1] + "]";
                        };
                        return NodeRange;
                    }());
                    minX = rect.minX, minY = rect.minY, maxX = rect.maxX, maxY = rect.maxY;
                    levelBounds = generateLevelBounds(numItems, nodeSize);
                    leafNodesOffset = levelBounds[0][0];
                    rootNodeRange = (function () {
                        var range = [0, 1];
                        var level = levelBounds.length - 1;
                        return new NodeRange(range, level);
                    })();
                    queue = [rootNodeRange];
                    Logger_1$1.default.debug("starting stream search with queue: " + queue + ", numItems: " + numItems + ", nodeSize: " + nodeSize + ", levelBounds: " + levelBounds);
                    _loop_1 = function () {
                        var next, nodeIndex, isLeafNode, _b, levelBound, end, length_1, buffer, float64Array, uint32Array, _loop_2, pos;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    next = queue.shift();
                                    Logger_1$1.default.debug("popped node: " + next + ", queueLength: " + queue.length);
                                    nodeIndex = next.startNode();
                                    isLeafNode = nodeIndex >= leafNodesOffset;
                                    _b = levelBounds[next.level()], levelBound = _b[1];
                                    end = Math.min(next.endNode() + nodeSize, levelBound);
                                    length_1 = end - nodeIndex;
                                    return [4, __await(readNode(nodeIndex * exports.NODE_ITEM_LEN, length_1 * exports.NODE_ITEM_LEN))];
                                case 1:
                                    buffer = _c.sent();
                                    float64Array = new Float64Array(buffer);
                                    uint32Array = new Uint32Array(buffer);
                                    _loop_2 = function (pos) {
                                        var nodePos, low32Offset, high32Offset, offset, combineRequestThreshold, tail, newNodeRange;
                                        return __generator(this, function (_d) {
                                            switch (_d.label) {
                                                case 0:
                                                    nodePos = (pos - nodeIndex) * 5;
                                                    if (maxX < float64Array[nodePos + 0])
                                                        return [2, "continue"];
                                                    if (maxY < float64Array[nodePos + 1])
                                                        return [2, "continue"];
                                                    if (minX > float64Array[nodePos + 2])
                                                        return [2, "continue"];
                                                    if (minY > float64Array[nodePos + 3])
                                                        return [2, "continue"];
                                                    low32Offset = uint32Array[(nodePos << 1) + 8];
                                                    high32Offset = uint32Array[(nodePos << 1) + 9];
                                                    offset = readUint52(high32Offset, low32Offset);
                                                    if (!isLeafNode) return [3, 3];
                                                    Logger_1$1.default.debug("yielding feature");
                                                    return [4, __await([offset, pos - leafNodesOffset])];
                                                case 1: return [4, _d.sent()];
                                                case 2:
                                                    _d.sent();
                                                    return [2, "continue"];
                                                case 3:
                                                    combineRequestThreshold = 256 * 1024 / exports.NODE_ITEM_LEN;
                                                    tail = queue[queue.length - 1];
                                                    if (tail !== undefined
                                                        && tail.level() == next.level() - 1
                                                        && offset < tail.endNode() + combineRequestThreshold) {
                                                        Logger_1$1.default.debug("Extending existing node: " + tail + ", newOffset: " + tail.endNode() + " -> " + offset);
                                                        tail.extendEndNodeToNewOffset(offset);
                                                        return [2, "continue"];
                                                    }
                                                    newNodeRange = (function () {
                                                        var level = next.level() - 1;
                                                        var range = [offset, offset + 1];
                                                        return new NodeRange(range, level);
                                                    })();
                                                    if (tail !== undefined && tail.level() == next.level() - 1) {
                                                        Logger_1$1.default.debug("pushing new node at offset: " + offset + " rather than merging with distant " + tail);
                                                    }
                                                    else {
                                                        Logger_1$1.default.debug("pushing new level for " + newNodeRange + " onto queue with tail: " + tail);
                                                    }
                                                    queue.push(newNodeRange);
                                                    return [2];
                                            }
                                        });
                                    };
                                    pos = nodeIndex;
                                    _c.label = 2;
                                case 2:
                                    if (!(pos < end)) return [3, 5];
                                    return [5, _loop_2(pos)];
                                case 3:
                                    _c.sent();
                                    _c.label = 4;
                                case 4:
                                    pos++;
                                    return [3, 2];
                                case 5: return [2];
                            }
                        });
                    };
                    _a.label = 1;
                case 1:
                    if (!(queue.length != 0)) return [3, 3];
                    return [5, _loop_1()];
                case 2:
                    _a.sent();
                    return [3, 1];
                case 3: return [2];
            }
        });
    });
}
exports.streamSearch = streamSearch;
function readUint52(high32Bits, low32Bits) {
    if ((high32Bits & 0xfff00000) != 0) {
        throw Error("integer is too large to be safely represented");
    }
    var result = low32Bits + (high32Bits * Math.pow(2, 32));
    return result;
}

});

unwrapExports(packedrtree);
var packedrtree_1 = packedrtree.streamSearch;
var packedrtree_2 = packedrtree.calcTreeSize;
var packedrtree_3 = packedrtree.DEFAULT_NODE_SIZE;
var packedrtree_4 = packedrtree.NODE_ITEM_LEN;

var constants = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.SIZE_PREFIX_LEN = exports.magicbytes = void 0;
exports.magicbytes = new Uint8Array([0x66, 0x67, 0x62, 0x03, 0x66, 0x67, 0x62, 0x00]);
exports.SIZE_PREFIX_LEN = 4;

});

unwrapExports(constants);
var constants_1 = constants.SIZE_PREFIX_LEN;
var constants_2 = constants.magicbytes;

var HttpReader_1 = createCommonjsModule(function (module, exports) {
var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (commonjsGlobal && commonjsGlobal.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (commonjsGlobal && commonjsGlobal.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); };
var __asyncDelegator = (commonjsGlobal && commonjsGlobal.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
};
var __asyncGenerator = (commonjsGlobal && commonjsGlobal.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __values = (commonjsGlobal && commonjsGlobal.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpReader = void 0;



var Logger_1$1 = __importDefault(Logger_1);
var HeaderMeta_1$1 = __importDefault(HeaderMeta_1);

var HttpReader = (function () {
    function HttpReader(headerClient, header, headerLength, indexLength) {
        this.headerClient = headerClient;
        this.header = header;
        this.headerLength = headerLength;
        this.indexLength = indexLength;
    }
    HttpReader.open = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var assumedHeaderLength, headerClient, assumedIndexLength, minReqLength, bytes_1, _a, headerLength, bytes_2, HEADER_MAX_BUFFER_SIZE, bytes, bb, header, indexLength;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        assumedHeaderLength = 2024;
                        headerClient = new BufferedHttpRangeClient(url);
                        assumedIndexLength = (function () {
                            var assumedBranchingFactor = packedrtree.DEFAULT_NODE_SIZE;
                            var prefetchedLayers = 3;
                            var result = 0;
                            var i;
                            for (i = 0; i < prefetchedLayers; i++) {
                                var layer_width = Math.pow(assumedBranchingFactor, i) * packedrtree.NODE_ITEM_LEN;
                                result += layer_width;
                            }
                            return result;
                        })();
                        minReqLength = assumedHeaderLength + assumedIndexLength;
                        Logger_1$1.default.debug("fetching header. minReqLength: " + minReqLength + " (assumedHeaderLength: " + assumedHeaderLength + ", assumedIndexLength: " + assumedIndexLength + ")");
                        _a = Uint8Array.bind;
                        return [4, headerClient.getRange(0, 8, minReqLength, "header")];
                    case 1:
                        bytes_1 = new (_a.apply(Uint8Array, [void 0, _b.sent()]))();
                        if (!bytes_1.every(function (v, i) { return constants.magicbytes[i] === v; })) {
                            Logger_1$1.default.error("bytes: " + bytes_1 + " != " + constants.magicbytes);
                            throw new Error('Not a FlatGeobuf file');
                        }
                        Logger_1$1.default.debug("magic bytes look good");
                        return [4, headerClient.getRange(8, 4, minReqLength, "header")];
                    case 2:
                        bytes_2 = _b.sent();
                        headerLength = new DataView(bytes_2).getUint32(0, true);
                        HEADER_MAX_BUFFER_SIZE = 1048576 * 10;
                        if (headerLength > HEADER_MAX_BUFFER_SIZE || headerLength < 8) {
                            throw new Error("Invalid header size");
                        }
                        Logger_1$1.default.debug("headerLength: " + headerLength);
                        return [4, headerClient.getRange(12, headerLength, minReqLength, "header")];
                    case 3:
                        bytes = _b.sent();
                        bb = new flatbuffers_1.flatbuffers.ByteBuffer(new Uint8Array(bytes));
                        header = HeaderMeta_1$1.default.fromByteBuffer(bb);
                        indexLength = packedrtree.calcTreeSize(header.featuresCount, header.indexNodeSize);
                        Logger_1$1.default.debug("completed: opening http reader");
                        return [2, new HttpReader(headerClient, header, headerLength, indexLength)];
                }
            });
        });
    };
    HttpReader.prototype.selectBbox = function (rect) {
        return __asyncGenerator(this, arguments, function selectBbox_1() {
            var lengthBeforeTree, bufferedClient, readNode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lengthBeforeTree = this.lengthBeforeTree();
                        bufferedClient = this.headerClient;
                        readNode = function (offsetIntoTree, size) {
                            return __awaiter(this, void 0, void 0, function () {
                                var minReqLength;
                                return __generator(this, function (_a) {
                                    minReqLength = 0;
                                    return [2, bufferedClient.getRange(lengthBeforeTree + offsetIntoTree, size, minReqLength, "index")];
                                });
                            });
                        };
                        Logger_1$1.default.debug("starting: selectBbox, traversing index. lengthBeforeTree: " + lengthBeforeTree);
                        return [5, __values(__asyncDelegator(__asyncValues(packedrtree.streamSearch(this.header.featuresCount, this.header.indexNodeSize, rect, readNode))))];
                    case 1: return [4, __await.apply(void 0, [_a.sent()])];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    HttpReader.prototype.lengthBeforeTree = function () {
        return constants.magicbytes.length + constants.SIZE_PREFIX_LEN + this.headerLength;
    };
    HttpReader.prototype.lengthBeforeFeatures = function () {
        return this.lengthBeforeTree() + this.indexLength;
    };
    HttpReader.prototype.featureClient = function () {
        if (this._featureClient === undefined) {
            this._featureClient = this.headerClient.clone();
        }
        return this._featureClient;
    };
    HttpReader.prototype.readFeature = function (featureOffset) {
        return __awaiter(this, void 0, void 0, function () {
            var minFeatureReqLength, offset, featureLength, bytes_3, byteBuffer, bytes, bytesAligned, bb;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        minFeatureReqLength = 128 * 1024;
                        offset = featureOffset + this.lengthBeforeFeatures();
                        return [4, this.featureClient().getRange(offset, 4, minFeatureReqLength, "feature length")];
                    case 1:
                        bytes_3 = _a.sent();
                        featureLength = new DataView(bytes_3).getUint32(0, true);
                        Logger_1$1.default.debug("featureOffset: " + offset + ", featureLength: " + featureLength);
                        return [4, this.featureClient().getRange(offset + 4, featureLength, minFeatureReqLength, "feature data")];
                    case 2:
                        byteBuffer = _a.sent();
                        bytes = new Uint8Array(byteBuffer);
                        bytesAligned = new Uint8Array(featureLength + constants.SIZE_PREFIX_LEN);
                        bytesAligned.set(bytes, constants.SIZE_PREFIX_LEN);
                        bb = new flatbuffers_1.flatbuffers.ByteBuffer(bytesAligned);
                        bb.setPosition(constants.SIZE_PREFIX_LEN);
                        return [2, feature_generated.Feature.getRoot(bb)];
                }
            });
        });
    };
    return HttpReader;
}());
exports.HttpReader = HttpReader;
var BufferedHttpRangeClient = (function () {
    function BufferedHttpRangeClient(source) {
        this.buffer = new ArrayBuffer(0);
        this.head = 0;
        if (typeof source === "string") {
            this.httpClient = new HttpRangeClient(source);
        }
        else {
            this.httpClient = source;
        }
    }
    BufferedHttpRangeClient.prototype.clone = function () {
        var newClient = new BufferedHttpRangeClient(this.httpClient);
        newClient.buffer = this.buffer.slice(0);
        newClient.head = this.head;
        return newClient;
    };
    BufferedHttpRangeClient.prototype.getRange = function (start, length, minReqLength, purpose) {
        return __awaiter(this, void 0, void 0, function () {
            var start_i, end_i, lengthToFetch, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        Logger_1$1.default.debug("need Range: " + start + "-" + (start + length - 1));
                        start_i = start - this.head;
                        end_i = start_i + length;
                        if (start_i >= 0 && end_i < this.buffer.byteLength) {
                            Logger_1$1.default.debug("slicing existing Range: " + start_i + "-" + (end_i - 1));
                            return [2, this.buffer.slice(start_i, end_i)];
                        }
                        lengthToFetch = Math.max(length, minReqLength);
                        _a = this;
                        return [4, this.httpClient.getRange(start, lengthToFetch, purpose)];
                    case 1:
                        _a.buffer = _b.sent();
                        this.head = start;
                        return [2, this.buffer.slice(0, length)];
                }
            });
        });
    };
    return BufferedHttpRangeClient;
}());
var HttpRangeClient = (function () {
    function HttpRangeClient(url) {
        this.requestsEverMade = 0;
        this.bytesEverRequested = 0;
        this.url = url;
    }
    HttpRangeClient.prototype.getRange = function (begin, length, purpose) {
        return __awaiter(this, void 0, void 0, function () {
            var range, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.requestsEverMade += 1;
                        this.bytesEverRequested += length;
                        range = "bytes=" + begin + "-" + (begin + length - 1);
                        Logger_1$1.default.debug("request: #" + this.requestsEverMade + ", purpose: " + purpose + "), bytes: (this_request: " + length + ", ever: " + this.bytesEverRequested + "), Range: " + range);
                        return [4, fetch(this.url, {
                                headers: {
                                    'Range': range
                                }
                            })];
                    case 1:
                        response = _a.sent();
                        return [2, response.arrayBuffer()];
                }
            });
        });
    };
    return HttpRangeClient;
}());

});

unwrapExports(HttpReader_1);
var HttpReader_2 = HttpReader_1.HttpReader;

var require$$0 = getCjsExportFromNamespace(sliceSource);

var featurecollection = createCommonjsModule(function (module, exports) {
var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __await = (commonjsGlobal && commonjsGlobal.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); };
var __asyncGenerator = (commonjsGlobal && commonjsGlobal.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __asyncValues = (commonjsGlobal && commonjsGlobal.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildHeader = exports.deserializeFiltered = exports.deserializeStream = exports.deserialize = exports.serialize = void 0;

var slice_source_1 = __importDefault(require$$0);
var ColumnMeta_1$1 = __importDefault(ColumnMeta_1);


var HeaderMeta_1$1 = __importDefault(HeaderMeta_1);



var Logger_1$1 = __importDefault(Logger_1);

var geometry_2 = geometry;

function serialize(features) {
    var headerMeta = introspectHeaderMeta(features);
    var header = buildHeader(headerMeta);
    var featureBuffers = features
        .map(function (f) {
        if (!f.getGeometry)
            throw new Error('Missing getGeometry implementation');
        if (!f.getProperties)
            throw new Error('Missing getProperties implementation');
        return feature.buildFeature(geometry_2.parseGeometry(f.getGeometry(), headerMeta.geometryType), f.getProperties(), headerMeta);
    });
    var featuresLength = featureBuffers
        .map(function (f) { return f.length; })
        .reduce(function (a, b) { return a + b; });
    var uint8 = new Uint8Array(constants.magicbytes.length + header.length + featuresLength);
    uint8.set(header, constants.magicbytes.length);
    var offset = constants.magicbytes.length + header.length;
    for (var _i = 0, featureBuffers_1 = featureBuffers; _i < featureBuffers_1.length; _i++) {
        var feature$1 = featureBuffers_1[_i];
        uint8.set(feature$1, offset);
        offset += feature$1.length;
    }
    uint8.set(constants.magicbytes);
    return uint8;
}
exports.serialize = serialize;
function deserialize(bytes, fromFeature, headerMetaFn) {
    if (!bytes.subarray(0, 7).every(function (v, i) { return constants.magicbytes[i] === v; }))
        throw new Error('Not a FlatGeobuf file');
    var bb = new flatbuffers_1.flatbuffers.ByteBuffer(bytes);
    var headerLength = bb.readUint32(constants.magicbytes.length);
    bb.setPosition(constants.magicbytes.length + constants.SIZE_PREFIX_LEN);
    var headerMeta = HeaderMeta_1$1.default.fromByteBuffer(bb);
    if (headerMetaFn)
        headerMetaFn(headerMeta);
    var offset = constants.magicbytes.length + constants.SIZE_PREFIX_LEN + headerLength;
    var indexNodeSize = headerMeta.indexNodeSize, featuresCount = headerMeta.featuresCount;
    if (indexNodeSize > 0)
        offset += packedrtree.calcTreeSize(featuresCount, indexNodeSize);
    var features = [];
    while (offset < bb.capacity()) {
        var featureLength = bb.readUint32(offset);
        bb.setPosition(offset + constants.SIZE_PREFIX_LEN);
        var feature = feature_generated.Feature.getRoot(bb);
        features.push(fromFeature(feature, headerMeta));
        offset += constants.SIZE_PREFIX_LEN + featureLength;
    }
    return features;
}
exports.deserialize = deserialize;
function deserializeStream(stream, fromFeature, headerMetaFn) {
    return __asyncGenerator(this, arguments, function deserializeStream_1() {
        var reader, read, bytes, _a, _b, bb, headerLength, _c, headerMeta, indexNodeSize, featuresCount, treeSize, feature;
        var _this = this;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    reader = slice_source_1.default(stream);
                    read = function (size) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, reader.slice(size)];
                            case 1: return [2, _a.sent()];
                        }
                    }); }); };
                    _a = Uint8Array.bind;
                    return [4, __await(read(8, "magic bytes"))];
                case 1:
                    bytes = new (_a.apply(Uint8Array, [void 0, _d.sent()]))();
                    if (!bytes.every(function (v, i) { return constants.magicbytes[i] === v; }))
                        throw new Error('Not a FlatGeobuf file');
                    _b = Uint8Array.bind;
                    return [4, __await(read(4, "header length"))];
                case 2:
                    bytes = new (_b.apply(Uint8Array, [void 0, _d.sent()]))();
                    bb = new flatbuffers_1.flatbuffers.ByteBuffer(bytes);
                    headerLength = bb.readUint32(0);
                    _c = Uint8Array.bind;
                    return [4, __await(read(headerLength, "header data"))];
                case 3:
                    bytes = new (_c.apply(Uint8Array, [void 0, _d.sent()]))();
                    bb = new flatbuffers_1.flatbuffers.ByteBuffer(bytes);
                    headerMeta = HeaderMeta_1$1.default.fromByteBuffer(bb);
                    if (headerMetaFn)
                        headerMetaFn(headerMeta);
                    indexNodeSize = headerMeta.indexNodeSize, featuresCount = headerMeta.featuresCount;
                    if (!(indexNodeSize > 0)) return [3, 5];
                    treeSize = packedrtree.calcTreeSize(featuresCount, indexNodeSize);
                    return [4, __await(read(treeSize, "entire index, w/o rect"))];
                case 4:
                    _d.sent();
                    _d.label = 5;
                case 5: return [4, __await(readFeature(read, headerMeta, fromFeature))];
                case 6:
                    if (!(feature = _d.sent())) return [3, 9];
                    return [4, __await(feature)];
                case 7: return [4, _d.sent()];
                case 8:
                    _d.sent();
                    return [3, 5];
                case 9: return [2];
            }
        });
    });
}
exports.deserializeStream = deserializeStream;
function deserializeFiltered(url, rect, fromFeature, headerMetaFn) {
    return __asyncGenerator(this, arguments, function deserializeFiltered_1() {
        var reader, _a, _b, featureOffset, feature, e_1_1;
        var e_1, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4, __await(HttpReader_1.HttpReader.open(url))];
                case 1:
                    reader = _d.sent();
                    Logger_1$1.default.debug("opened reader");
                    if (headerMetaFn) {
                        headerMetaFn(reader.header);
                    }
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 10, 11, 16]);
                    _a = __asyncValues(reader.selectBbox(rect));
                    _d.label = 3;
                case 3: return [4, __await(_a.next())];
                case 4:
                    if (!(_b = _d.sent(), !_b.done)) return [3, 9];
                    featureOffset = _b.value;
                    return [4, __await(reader.readFeature(featureOffset[0]))];
                case 5:
                    feature = _d.sent();
                    return [4, __await(fromFeature(feature, reader.header))];
                case 6: return [4, _d.sent()];
                case 7:
                    _d.sent();
                    _d.label = 8;
                case 8: return [3, 3];
                case 9: return [3, 16];
                case 10:
                    e_1_1 = _d.sent();
                    e_1 = { error: e_1_1 };
                    return [3, 16];
                case 11:
                    _d.trys.push([11, , 14, 15]);
                    if (!(_b && !_b.done && (_c = _a.return))) return [3, 13];
                    return [4, __await(_c.call(_a))];
                case 12:
                    _d.sent();
                    _d.label = 13;
                case 13: return [3, 15];
                case 14:
                    if (e_1) throw e_1.error;
                    return [7];
                case 15: return [7];
                case 16: return [2];
            }
        });
    });
}
exports.deserializeFiltered = deserializeFiltered;
function readFeature(read, headerMeta, fromFeature) {
    return __awaiter(this, void 0, void 0, function () {
        var bytes, _a, bb, featureLength, _b, bytesAligned, feature;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = Uint8Array.bind;
                    return [4, read(4, "feature length")];
                case 1:
                    bytes = new (_a.apply(Uint8Array, [void 0, _c.sent()]))();
                    if (bytes.byteLength === 0)
                        return [2];
                    bb = new flatbuffers_1.flatbuffers.ByteBuffer(bytes);
                    featureLength = bb.readUint32(0);
                    _b = Uint8Array.bind;
                    return [4, read(featureLength, "feature data")];
                case 2:
                    bytes = new (_b.apply(Uint8Array, [void 0, _c.sent()]))();
                    bytesAligned = new Uint8Array(featureLength + 4);
                    bytesAligned.set(bytes, 4);
                    bb = new flatbuffers_1.flatbuffers.ByteBuffer(bytesAligned);
                    bb.setPosition(constants.SIZE_PREFIX_LEN);
                    feature = feature_generated.Feature.getRoot(bb);
                    return [2, fromFeature(feature, headerMeta)];
            }
        });
    });
}
function buildColumn(builder, column) {
    var nameOffset = builder.createString(column.name);
    header_generated.Column.start(builder);
    header_generated.Column.addName(builder, nameOffset);
    header_generated.Column.addType(builder, column.type);
    return header_generated.Column.end(builder);
}
function buildHeader(header) {
    var builder = new flatbuffers_1.flatbuffers.Builder();
    var columnOffsets = null;
    if (header.columns)
        columnOffsets = header_generated.Header.createColumnsVector(builder, header.columns.map(function (c) { return buildColumn(builder, c); }));
    var nameOffset = builder.createString('L1');
    header_generated.Header.start(builder);
    header_generated.Header.addFeaturesCount(builder, new flatbuffers_1.flatbuffers.Long(header.featuresCount, 0));
    header_generated.Header.addGeometryType(builder, header.geometryType);
    header_generated.Header.addIndexNodeSize(builder, 0);
    if (columnOffsets)
        header_generated.Header.addColumns(builder, columnOffsets);
    header_generated.Header.addName(builder, nameOffset);
    var offset = header_generated.Header.end(builder);
    builder.finishSizePrefixed(offset);
    return builder.asUint8Array();
}
exports.buildHeader = buildHeader;
function valueToType(value) {
    if (typeof value === 'boolean')
        return header_generated.ColumnType.Bool;
    else if (typeof value === 'number')
        if (value % 1 === 0)
            return header_generated.ColumnType.Int;
        else
            return header_generated.ColumnType.Double;
    else if (typeof value === 'string')
        return header_generated.ColumnType.String;
    else if (value === null)
        return header_generated.ColumnType.String;
    else
        throw new Error("Unknown type (value '" + value + "')");
}
function introspectHeaderMeta(features) {
    var feature = features[0];
    var geometry$1 = feature.getGeometry ? feature.getGeometry() : undefined;
    var geometryType = geometry$1 ? geometry$1.getType() : undefined;
    var properties = feature.getProperties ? feature.getProperties() : {};
    var columns = null;
    if (properties)
        columns = Object.keys(properties).filter(function (key) { return key !== 'geometry'; })
            .map(function (k) { return new ColumnMeta_1$1.default(k, valueToType(properties[k]), null, null, -1, -1, -1, true, false, false); });
    var headerMeta = new HeaderMeta_1$1.default(geometry.toGeometryType(geometryType), columns, features.length, 0, null, null, null, null);
    return headerMeta;
}

});

unwrapExports(featurecollection);
var featurecollection_1 = featurecollection.buildHeader;
var featurecollection_2 = featurecollection.deserializeFiltered;
var featurecollection_3 = featurecollection.deserializeStream;
var featurecollection_4 = featurecollection.deserialize;
var featurecollection_5 = featurecollection.serialize;

var featurecollection$1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeFiltered = exports.deserializeStream = exports.deserialize = exports.serialize = void 0;
var ColumnMeta_1$1 = __importDefault(ColumnMeta_1);

var HeaderMeta_1$1 = __importDefault(HeaderMeta_1);






function serialize(featurecollection$1) {
    var headerMeta = introspectHeaderMeta(featurecollection$1);
    var header = featurecollection.buildHeader(headerMeta);
    var features = featurecollection$1.features
        .map(function (f) { return feature.buildFeature(geometry$1.parseGeometry(f.geometry), f.properties, headerMeta); });
    var featuresLength = features
        .map(function (f) { return f.length; })
        .reduce(function (a, b) { return a + b; });
    var uint8 = new Uint8Array(constants.magicbytes.length + header.length + featuresLength);
    uint8.set(header, constants.magicbytes.length);
    var offset = constants.magicbytes.length + header.length;
    for (var _i = 0, features_1 = features; _i < features_1.length; _i++) {
        var feature$1 = features_1[_i];
        uint8.set(feature$1, offset);
        offset += feature$1.length;
    }
    uint8.set(constants.magicbytes);
    return uint8;
}
exports.serialize = serialize;
function deserialize(bytes, headerMetaFn) {
    var features = featurecollection.deserialize(bytes, feature$1.fromFeature, headerMetaFn);
    return {
        type: 'FeatureCollection',
        features: features,
    };
}
exports.deserialize = deserialize;
function deserializeStream(stream, headerMetaFn) {
    return featurecollection.deserializeStream(stream, feature$1.fromFeature, headerMetaFn);
}
exports.deserializeStream = deserializeStream;
function deserializeFiltered(url, rect, headerMetaFn) {
    return featurecollection.deserializeFiltered(url, rect, feature$1.fromFeature, headerMetaFn);
}
exports.deserializeFiltered = deserializeFiltered;
function valueToType(value) {
    if (typeof value === 'boolean')
        return header_generated.ColumnType.Bool;
    else if (typeof value === 'number')
        if (value % 1 === 0)
            return header_generated.ColumnType.Int;
        else
            return header_generated.ColumnType.Double;
    else if (typeof value === 'string')
        return header_generated.ColumnType.String;
    else if (value === null)
        return header_generated.ColumnType.String;
    else
        throw new Error("Unknown type (value '" + value + "')");
}
function introspectHeaderMeta(featurecollection) {
    var feature = featurecollection.features[0];
    var properties = feature.properties;
    var columns = null;
    if (properties)
        columns = Object.keys(properties)
            .map(function (k) { return new ColumnMeta_1$1.default(k, valueToType(properties[k]), null, null, -1, -1, -1, true, false, false); });
    var headerMeta = new HeaderMeta_1$1.default(geometry.toGeometryType(feature.geometry.type), columns, featurecollection.features.length, 0, null, null, null, null);
    return headerMeta;
}

});

unwrapExports(featurecollection$1);
var featurecollection_2$1 = featurecollection$1.deserializeFiltered;
var featurecollection_3$1 = featurecollection$1.deserializeStream;
var featurecollection_4$1 = featurecollection$1.deserialize;
var featurecollection_5$1 = featurecollection$1.serialize;

var geojson = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserialize = exports.serialize = void 0;

function serialize(geojson) {
    var bytes = featurecollection$1.serialize(geojson);
    return bytes;
}
exports.serialize = serialize;
function deserialize(input, rect, headerMetaFn) {
    if (input instanceof Uint8Array)
        return featurecollection$1.deserialize(input, headerMetaFn);
    else if (input instanceof ReadableStream)
        return featurecollection$1.deserializeStream(input, headerMetaFn);
    else
        return featurecollection$1.deserializeFiltered(input, rect, headerMetaFn);
}
exports.deserialize = deserialize;

});

unwrapExports(geojson);
var geojson_1 = geojson.deserialize;
var geojson_2 = geojson.serialize;

var d2r = Math.PI / 180,
    r2d = 180 / Math.PI;

/**
 * Get the bbox of a tile
 *
 * @name tileToBBOX
 * @param {Array<number>} tile
 * @returns {Array<number>} bbox
 * @example
 * var bbox = tileToBBOX([5, 10, 10])
 * //=bbox
 */
function tileToBBOX(tile) {
    var e = tile2lon(tile[0] + 1, tile[2]);
    var w = tile2lon(tile[0], tile[2]);
    var s = tile2lat(tile[1] + 1, tile[2]);
    var n = tile2lat(tile[1], tile[2]);
    return [w, s, e, n];
}

/**
 * Get a geojson representation of a tile
 *
 * @name tileToGeoJSON
 * @param {Array<number>} tile
 * @returns {Feature<Polygon>}
 * @example
 * var poly = tileToGeoJSON([5, 10, 10])
 * //=poly
 */
function tileToGeoJSON(tile) {
    var bbox = tileToBBOX(tile);
    var poly = {
        type: 'Polygon',
        coordinates: [[
            [bbox[0], bbox[3]],
            [bbox[0], bbox[1]],
            [bbox[2], bbox[1]],
            [bbox[2], bbox[3]],
            [bbox[0], bbox[3]]
        ]]
    };
    return poly;
}

function tile2lon(x, z) {
    return x / Math.pow(2, z) * 360 - 180;
}

function tile2lat(y, z) {
    var n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
    return r2d * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
}

/**
 * Get the tile for a point at a specified zoom level
 *
 * @name pointToTile
 * @param {number} lon
 * @param {number} lat
 * @param {number} z
 * @returns {Array<number>} tile
 * @example
 * var tile = pointToTile(1, 1, 20)
 * //=tile
 */
function pointToTile(lon, lat, z) {
    var tile = pointToTileFraction(lon, lat, z);
    tile[0] = Math.floor(tile[0]);
    tile[1] = Math.floor(tile[1]);
    return tile;
}

/**
 * Get the 4 tiles one zoom level higher
 *
 * @name getChildren
 * @param {Array<number>} tile
 * @returns {Array<Array<number>>} tiles
 * @example
 * var tiles = getChildren([5, 10, 10])
 * //=tiles
 */
function getChildren(tile) {
    return [
        [tile[0] * 2, tile[1] * 2, tile[2] + 1],
        [tile[0] * 2 + 1, tile[1] * 2, tile[2 ] + 1],
        [tile[0] * 2 + 1, tile[1] * 2 + 1, tile[2] + 1],
        [tile[0] * 2, tile[1] * 2 + 1, tile[2] + 1]
    ];
}

/**
 * Get the tile one zoom level lower
 *
 * @name getParent
 * @param {Array<number>} tile
 * @returns {Array<number>} tile
 * @example
 * var tile = getParent([5, 10, 10])
 * //=tile
 */
function getParent(tile) {
    return [tile[0] >> 1, tile[1] >> 1, tile[2] - 1];
}

function getSiblings(tile) {
    return getChildren(getParent(tile));
}

/**
 * Get the 3 sibling tiles for a tile
 *
 * @name getSiblings
 * @param {Array<number>} tile
 * @returns {Array<Array<number>>} tiles
 * @example
 * var tiles = getSiblings([5, 10, 10])
 * //=tiles
 */
function hasSiblings(tile, tiles) {
    var siblings = getSiblings(tile);
    for (var i = 0; i < siblings.length; i++) {
        if (!hasTile(tiles, siblings[i])) return false;
    }
    return true;
}

/**
 * Check to see if an array of tiles contains a particular tile
 *
 * @name hasTile
 * @param {Array<Array<number>>} tiles
 * @param {Array<number>} tile
 * @returns {boolean}
 * @example
 * var tiles = [
 *     [0, 0, 5],
 *     [0, 1, 5],
 *     [1, 1, 5],
 *     [1, 0, 5]
 * ]
 * hasTile(tiles, [0, 0, 5])
 * //=boolean
 */
function hasTile(tiles, tile) {
    for (var i = 0; i < tiles.length; i++) {
        if (tilesEqual(tiles[i], tile)) return true;
    }
    return false;
}

/**
 * Check to see if two tiles are the same
 *
 * @name tilesEqual
 * @param {Array<number>} tile1
 * @param {Array<number>} tile2
 * @returns {boolean}
 * @example
 * tilesEqual([0, 1, 5], [0, 0, 5])
 * //=boolean
 */
function tilesEqual(tile1, tile2) {
    return (
        tile1[0] === tile2[0] &&
        tile1[1] === tile2[1] &&
        tile1[2] === tile2[2]
    );
}

/**
 * Get the quadkey for a tile
 *
 * @name tileToQuadkey
 * @param {Array<number>} tile
 * @returns {string} quadkey
 * @example
 * var quadkey = tileToQuadkey([0, 1, 5])
 * //=quadkey
 */
function tileToQuadkey(tile) {
    var index = '';
    for (var z = tile[2]; z > 0; z--) {
        var b = 0;
        var mask = 1 << (z - 1);
        if ((tile[0] & mask) !== 0) b++;
        if ((tile[1] & mask) !== 0) b += 2;
        index += b.toString();
    }
    return index;
}

/**
 * Get the tile for a quadkey
 *
 * @name quadkeyToTile
 * @param {string} quadkey
 * @returns {Array<number>} tile
 * @example
 * var tile = quadkeyToTile('00001033')
 * //=tile
 */
function quadkeyToTile(quadkey) {
    var x = 0;
    var y = 0;
    var z = quadkey.length;

    for (var i = z; i > 0; i--) {
        var mask = 1 << (i - 1);
        var q = +quadkey[z - i];
        if (q === 1) x |= mask;
        if (q === 2) y |= mask;
        if (q === 3) {
            x |= mask;
            y |= mask;
        }
    }
    return [x, y, z];
}

/**
 * Get the smallest tile to cover a bbox
 *
 * @name bboxToTile
 * @param {Array<number>} bbox
 * @returns {Array<number>} tile
 * @example
 * var tile = bboxToTile([ -178, 84, -177, 85 ])
 * //=tile
 */
function bboxToTile(bboxCoords) {
    var min = pointToTile(bboxCoords[0], bboxCoords[1], 32);
    var max = pointToTile(bboxCoords[2], bboxCoords[3], 32);
    var bbox = [min[0], min[1], max[0], max[1]];

    var z = getBboxZoom(bbox);
    if (z === 0) return [0, 0, 0];
    var x = bbox[0] >>> (32 - z);
    var y = bbox[1] >>> (32 - z);
    return [x, y, z];
}

function getBboxZoom(bbox) {
    var MAX_ZOOM = 28;
    for (var z = 0; z < MAX_ZOOM; z++) {
        var mask = 1 << (32 - (z + 1));
        if (((bbox[0] & mask) !== (bbox[2] & mask)) ||
            ((bbox[1] & mask) !== (bbox[3] & mask))) {
            return z;
        }
    }

    return MAX_ZOOM;
}

/**
 * Get the precise fractional tile location for a point at a zoom level
 *
 * @name pointToTileFraction
 * @param {number} lon
 * @param {number} lat
 * @param {number} z
 * @returns {Array<number>} tile fraction
 * var tile = pointToTileFraction(30.5, 50.5, 15)
 * //=tile
 */
function pointToTileFraction(lon, lat, z) {
    var sin = Math.sin(lat * d2r),
        z2 = Math.pow(2, z),
        x = z2 * (lon / 360 + 0.5),
        y = z2 * (0.5 - 0.25 * Math.log((1 + sin) / (1 - sin)) / Math.PI);

    // Wrap Tile X
    x = x % z2;
    if (x < 0) x = x + z2;
    return [x, y, z];
}

var tilebelt = {
    tileToGeoJSON: tileToGeoJSON,
    tileToBBOX: tileToBBOX,
    getChildren: getChildren,
    getParent: getParent,
    getSiblings: getSiblings,
    hasTile: hasTile,
    hasSiblings: hasSiblings,
    tilesEqual: tilesEqual,
    tileToQuadkey: tileToQuadkey,
    quadkeyToTile: quadkeyToTile,
    pointToTile: pointToTile,
    bboxToTile: bboxToTile,
    pointToTileFraction: pointToTileFraction
};

class FlatGeobuf {
  constructor (sourceId, map, flatGeobufOptions, geojsonSourceOptions) {
    if (!sourceId || !map || !flatGeobufOptions) throw new Error('Source id, map and url must be supplied as the first three arguments.')
    if (!flatGeobufOptions.url) throw new Error('A url must be supplied as part of the flatGeobufOptions object.')
    if (!flatGeobufOptions.idProperty) throw new Error('A idProperty must be supplied as part of the flatGeobufOptions object.')

    this.sourceId = sourceId;
    this._map = map;
    this._flatGeobufOptions = Object.assign(flatGeobufOptions, {
      minZoom: 9
    });
    this._options = geojsonSourceOptions ? geojsonSourceOptions : {};

    this._fc = this._getBlankFc();
    this._map.addSource(sourceId, Object.assign(this._options, {
      type: 'geojson',
      data: this._fc
    }));
    this._maxExtent = [-Infinity, Infinity, -Infinity, Infinity];

    this._tileIds = new Map();
    this._fcIds = new Map();

    this.enableRequests();
    this._getTileData();
  }

  destroySource () {
    this.disableRequests();
    this._map.removeSource(this.sourceId);
  }

  disableRequests () {
    this._map.off('moveend', this._boundEvent);
  }

  enableRequests () {
    this._boundEvent = this._getTileData.bind(this);
    this._map.on('moveend', this._boundEvent);
  }

  _getBlankFc () {
    return {
      type: 'FeatureCollection',
      features: []
    }
  }

  async _getTileData () {
    const z = this._map.getZoom();
    if (z < this._flatGeobufOptions.minZoom) return
  
    const bounds = this._map.getBounds().toArray();
    const primaryTile = tilebelt.bboxToTile([bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1]]);
    const tilesToRequest = [];

    if (primaryTile[2] < this._flatGeobufOptions.minZoom) {
      let candidateTiles = tilebelt.getChildren(primaryTile);
      let minZoomOfCandidates = candidateTiles[0][2];
      while (minZoomOfCandidates < this._flatGeobufOptions.minZoom) {
        const newCandidateTiles = [];
        candidateTiles.forEach(t => newCandidateTiles.push(...tilebelt.getChildren(t)));
        candidateTiles = newCandidateTiles;
        minZoomOfCandidates = candidateTiles[0][2];
      }
      for (let index = 0; index < candidateTiles.length; index++) {
        const t = candidateTiles[index];
        if (this._doesTileOverlapBbox(t, bounds)) {
          tilesToRequest.push(t);
        }
      }
    } else {
      tilesToRequest.push(primaryTile);
    }

    for (let index = 0; index < tilesToRequest.length; index++) {
      const t = tilesToRequest[index];
      const quadKey = tilebelt.tileToQuadkey(t);
      if (this._tileIds.has(quadKey)) {
        tilesToRequest.splice(index, 1);
        index--;
      } else this._tileIds.set(quadKey, true);
    }
  
    if (tilesToRequest.length === 0) return
    const compiledBbox = mergeBoundingBoxes(tilesToRequest);
    let iter = this._loadData(compiledBbox);
    await this.iterateItems(iter);
    this._updateFc();
  }

  async iterateItems (iterator) {
    for await (let feature of iterator) {
      if (this._fcIds.has(feature.properties[this._flatGeobufOptions.idProperty])) continue
      this._fc.features.push(feature);
      this._fcIds.set(feature.properties[this._flatGeobufOptions.idProperty]);
    }
  }

  _updateFc (fc) {
    this._map.getSource(this.sourceId).setData(this._fc);
  }

  _doesTileOverlapBbox(tile, bbox) {
    const tileBounds = tile.length === 4 ? tile : tilebelt.tileToBBOX(tile);
    if (tileBounds[2] < bbox[0][0]) return false
    if (tileBounds[0] > bbox[1][0]) return false
    if (tileBounds[3] < bbox[0][1]) return false
    if (tileBounds[1] > bbox[1][1]) return false
    return true
  }

  _loadData (bounds) {
    return geojson_1(this._flatGeobufOptions.url, fgBoundingBox(bounds))
  }
}


function mergeBoundingBoxes (bboxes) {
  let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;

  for (let index = 0; index < bboxes.length; index++) {
    const tileBounds = tilebelt.tileToBBOX(bboxes[index]);
    xMin = Math.min(xMin, tileBounds[0]);
    xMax = Math.max(xMax, tileBounds[2]);
    yMin = Math.min(yMin, tileBounds[1]);
    yMax = Math.max(yMax, tileBounds[3]);
  }
  return [xMin, yMin, xMax, yMax]
}

function fgBoundingBox(bounds) {
  return {
      minX: bounds[0],
      maxX: bounds[2],
      minY: bounds[1],
      maxY: bounds[3],
  };
}

export default FlatGeobuf;
